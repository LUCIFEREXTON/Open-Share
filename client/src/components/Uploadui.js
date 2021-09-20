import React from "react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import compose from "recompose/compose";
import { connect } from "react-redux";
import { uploadFile } from "react-s3";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import FileListItem from "./FileListItem";
import ReplayIcon from "@material-ui/icons/Replay";
import "./style.css";

const config = {
  bucketName: "opensharepdfs",
  region: "us-east-2",
  accessKeyId: "AKIA6FWNN2ZOEAFBJFDW",
  secretAccessKey: "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",
};

const styles = (theme) => ({
  button: {
    margin: 1,
  },
  demo: {
    maxWidth: "70vw",
    borderTop: "1px solid lightgray",
    marginTop: "10px",
    paddingTop: "10px",
  },
});

const hasProp = (objarr, proparr) =>
  objarr.length > 0 &&
  objarr.every((obj) => proparr.every((key) => key in obj));

const Uploadui = ({ classes, signedInUser }) => {
  const inputfiles = useRef(null);

  const [files, setfiles] = useState([]);

  const [loading, setloading] = useState(false);

  const [uploadfiles, setuploadfiles] = useState([]);
  const uploaded = useRef(false);
  const [reload, setreload] = useState(false);
  //to check if dov meet particular format
  const onchange = (e) => {
    const temp = [...e.target.files].filter((file) =>
      ["pdf", "docx", "csv", "pptx", "doc", "zip"].includes(
        file.name.split(".").pop()
      )
    );
    setfiles([...files, ...temp]);
  };
  //uplaod to amazaon s3
  const uploadHandler = () => {
    if (!files[0]) {
      alert("Choose files first");
    } else if (!hasProp(uploadfiles, ["name", "type", "year", "subjectName"])) {
      alert("Input all fields of all files");
    } else {
      //start loading
      setloading(true);
      //create set so that no two same files gets uploaded
      const newFileList = [];
      new Set(files).forEach((file) => newFileList.push(file));
      //create promise array for all docs
      const promises = newFileList.map((file) => uploadFile(file, config));
      Promise.all(promises)
        .then((resfiles) => {
          inputfiles.current.value = "";
          setuploadfiles([
            ...resfiles.map((file, i) => ({
              ...uploadfiles[i],
              url: file.location,
              authorId: signedInUser.userId,
            })),
          ]);
          uploaded.current = true;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  //upload to database
  useEffect(() => {
    (async () => {
      if (
        uploaded.current &&
        hasProp(uploadfiles, [
          "name",
          "type",
          "year",
          "subjectName",
          "authorId",
          "url",
        ])
      ) {
        try {
          const res = await axios.post("/posts/savefiles", { uploadfiles });
          if (res.data.success) {
            setloading(false);
            setfiles([]);
            setuploadfiles([]);
            setreload(true);
            setInterval(() => {
              setreload(false);
            }, 5000);
          }
        } catch (err) {
          setloading(false);
          console.log(err);
        }
      }
    })();
  }, [uploadfiles]);

  const setfiledetails = (i, details) => {
    const temp = [...uploadfiles];
    temp[i] = { ...details };
    setuploadfiles(temp);
  };

  const deletethis = (i) => {
    setfiles([...files.filter((file, index) => i !== index)]);
  };

  return (
    <div className="uploadsection">
      {" "}
      {loading && (
        <div className="loading">
          {" "}
          <CircularProgress />{" "}
        </div>
      )}{" "}
      <div className="inputfields">
        <input
          type="file"
          id="files"
          accept=".pdf,.docx,.csv,.pptx,.doc,.zip"
          multiple
          ref={inputfiles}
          onChange={onchange}
        />{" "}
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onClick={uploadHandler}
        >
          Upload Files{" "}
        </Button>{" "}
      </div>{" "}
      <div className={classes.demo}>
        {" "}
        {files.length !== 0 && (
          <List>
            {" "}
            <strong>
              {" "}
              Only Files Showing in this area will be selected to upload{" "}
            </strong>{" "}
            {files.map((file, i) => (
              <FileListItem
                key={i}
                setfiledetails={setfiledetails}
                file={file}
                i={i}
                deletethis={deletethis}
              />
            ))}{" "}
          </List>
        )}{" "}
      </div>{" "}
      {reload && (
        <div className="reload">
          <center>
            {" "}
            <ReplayIcon />{" "}
          </center>{" "}
          <center> Reload to update materials </center>{" "}
        </div>
      )}{" "}
    </div>
  );
};

const mapStateToProps = (state) => ({
  signedInUser: state.authReducer.user,
});

export default compose(withStyles(styles), connect(mapStateToProps))(Uploadui);
