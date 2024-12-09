import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';

import PlayButton from './PlayButton';

function PlayTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: '98%' }}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

PlayTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function playTabProps(index) {
  return {
    id: `play-tab-${index}`,
    'aria-controls': `play-tab-panel-${index}`,
  };
}

let dracoInteval;
const startDracoPlay = (props, callback) => {
  let progress = props.progress2;
  dracoInteval = setInterval(() => {
    progress = progress + 1;
    if (progress >= 100) {
      progress = 0;
      props.disabled2 = 0;
      clearInterval(dracoInteval);
    }
    callback({ ...props, 'progress2': progress });
  }, 200);
}

export function PlayTabs() {
  const [tabValue, setTabValue] = React.useState(0);
  const [state, setState] = React.useState({
    progress1: 0,
    progress2: 0,
    disabled1: 0,
    disabled2: 0
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const startPlayClick = (tabIndex) => {
    if (tabIndex == 0) {
      let progress = state.progress1 + 5;
      setState({ ...state, 'progress1': progress });
      return;
    }
    if (tabIndex == 1) {
      state.disabled2 = 1;
      startDracoPlay(state, setState);
    }
  };

  const stopPlayClick = (tabIndex) => {
    if (tabIndex == 0) {
    }
    if (tabIndex == 1) {
      console.log("processs2:\t" + state.progress2);
      setState({ ...state, 'disabled2': 0 });
      clearInterval(dracoInteval);
    }
  };

  React.useEffect(() => {
    document.title = "点云播放测试";
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: '1em' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ pl: '2em' }}>
          <Tab label="非Darco播放" {...playTabProps(0)} style={{ textTransform: 'none' }} />
          <Tab label="Draco播放" {...playTabProps(1)} style={{ textTransform: 'none' }} />
        </Tabs>
      </Box>
      <PlayTabPanel value={tabValue} index={0}>
        <Alert severity="warning" icon={false}>
          不用<b>Draco</b>播放
          &nbsp;<PlayButton index={0} size="small" onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={0} size="small" color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <br />
        <LinearProgress variant="determinate" value={state.progress1} color="success" />
      </PlayTabPanel>
      <PlayTabPanel value={tabValue} index={1}>
        <Alert severity="info" icon={false}>
          利用<b>Draco</b>播放
          &nbsp;<PlayButton index={1} disabled={state.disabled2} onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={1} size="small" color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <br />
        <LinearProgress variant="determinate" value={state.progress2} color="success" />
      </PlayTabPanel>
    </Box>
  );
}