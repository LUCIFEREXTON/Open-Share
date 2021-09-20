import React, {useState, useEffect} from "react";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import axios from "axios";
import './style.css';
const Showmaterial = () =>{
    const [files, setfiles] = useState([]);
    const [backupfiles, setbackupfiles] = useState([]);
    backupfiles[0] && console.log(backupfiles)
    const [name, setname] = useState("");
    const [year, setyear] = useState("0");
    const [category, setcategory] = useState("ALL");
    useEffect(() => {
        (async () => {
            try{
                const res = await axios.get('/posts/getfiles');
                setfiles([...res.data.allfiles]);
                setbackupfiles([...res.data.allfiles]);
            }catch(err){
                console.log(err);
            }
        })()
    }, [])
    useEffect(() => {
        const temp = backupfiles.filter(file => (( name==="" || file.name.toLowerCase().includes(name.toLowerCase())) && (year==="0" || file.year===parseInt(year)) && (category==="ALL" || file.type.toLowerCase().includes(category.toLowerCase()))));
        setfiles([...temp])
    },[name, year, category])
    return(
        <div>
            {
                backupfiles.length>0 && 
                <div className="search">
                    <TextField id="standard-basic" value={name} onChange={e=>{setname(e.target.value)}}label="Name" variant="standard" />
                    <TextField
                        id="standard-select-year"
                        select
                        label="Year"
                        value={year}
                        onChange={e=>{setyear(e.target.value)}}
                        helperText="Please select your year"
                        variant="standard"
                        >
                            <MenuItem key="0" value="0">
                                All
                            </MenuItem>
                            <MenuItem key="1" value="1">
                                1st
                            </MenuItem>
                            <MenuItem key="2" value="2">
                                2nd
                            </MenuItem>
                            <MenuItem key="3" value="3">
                                3rd
                            </MenuItem>
                            <MenuItem key="4" value="4">
                                4th
                            </MenuItem>
                    </TextField>
                    <TextField
                        id="standard-select-Category"
                        select
                        label="Category"
                        value={category}
                        onChange={e=>{setcategory(e.target.value)}}
                        helperText="Please select your Category"
                        variant="standard"
                        >
                             <MenuItem key="5" value="ALL">All</MenuItem>
                             <MenuItem key="0" value="Course">Course Matetial</MenuItem>
                             <MenuItem key="1" value="Placement">Placement Material</MenuItem>
                             <MenuItem key="2" value="Event">College Events</MenuItem>
                             <MenuItem key="3" value="Misc">Miscellaneous</MenuItem>
                             
                    </TextField>
                </div>
            }
            {
                files.length?files.map(file=><div className="docfile" key={file._id}><a target="_blank" href={file.url}><h3>{file.name}</h3></a></div>):"No files to show"
            }
        </div>
    );
}

export default Showmaterial;