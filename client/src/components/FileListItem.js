
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  delbtn:{
    right: '-17px'
  },
  inputwarp:{  
    flexWrap: 'wrap'
  }
})


const FileListItem = ({file, classes, i, deletethis, setfiledetails})=>{

  const [name, setname] = useState(file.name);
  const [type, settype] = useState("Course");
  const [year, setyear] = useState('-1');
  const [sub, setsub] = useState('');
  const [sublist, setlist] = useState([]);
  useEffect(() => {
    if(name.length>0 && (year>=0 || (year>0 && sub)))
      setfiledetails(i, {name, type, year, subjectName:sub});
  }, [name, type, year, sub]);

  useEffect(() => {
    (async()=>{
      if(year>0){
        try{
          const res = await axios.get(`/posts/getsubnames/${year}`);
          if(res.data.subNames){
            setlist([...res.data.subNames]);
          }
        }catch(err){
          console.error(err);
        }
      }
    })()
  }, [year])

    return(
        <ListItem className={classes.inputwarp} key={i}>
                                                <ListItemIcon>
                                                  {file.type==="application/pdf"?<PictureAsPdfIcon />:<DescriptionIcon />}
                                                </ListItemIcon>
                                                <ListItemText
                                                  primary={file.name}
                                                />
                                                <input style={{ padding: '5px',fontSize: '16px'}} type="text" value={name} onChange={(e)=>{setname(e.target.value)}} placeholder="Put your Filename"/>
                                                <select value={type} onChange={(e)=>{settype(e.target.value)}} style={{ padding: '5px',fontSize: '16px'}}>
                                                  <option value="Course">Course Matetial</option>
                                                  <option value="Placement">Placement Material</option>
                                                  <option value="Event">College Events</option>
                                                  <option value="Misc">Miscellaneous</option>
                                                </select>
                                                <select value={year} onChange={(e)=>{setyear(e.target.value)}} style={{ padding: '5px',fontSize: '16px'}}>
                                                  <option value='-1'>Select Year</option>
                                                  <option value='0'>NA</option>
                                                  <option value="1">1st</option>
                                                  <option value="2">2nd</option>
                                                  <option value="3">3rd</option>
                                                  <option value="4">4th</option>
                                                </select>
                                                <input type="text" value={sub} list="sublist" onChange={(e)=>{setsub(e.target.value)}}  placeholder="Subject" style={{ padding: '5px',fontSize: '16px'}}/>
                                                <datalist id="sublist">
                                                  {sublist.length>0 && sublist.map(sub=><option key={sub._id} value={sub.name}/>)}
                                                </datalist>
                                                <ListItemSecondaryAction  className={classes.delbtn}>
                                                  <IconButton edge="end" aria-label="delete">
                                                    <DeleteIcon onClick={()=>{deletethis(i)}} />
                                                  </IconButton>
                                                </ListItemSecondaryAction>                                            
                                              </ListItem>
    );
}

export default withStyles(styles)(FileListItem);