import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import PlayArea from './playArea';
import PlayButton from './PlayButton';

import { startPcdPlay, startDracoPlay, loadPcdDataInfo } from './playFunc';
import { playPcd } from './playPcd'

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

let pcds = await loadPcdDataInfo('http://127.0.0.1:8000/pcds/listPcdFiles');

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

var interval = {
  'interval0': null,
  'interval1': null
}

const { innerHeight: height } = window;
const playAreaHeight = height - 240;
const play_pcd_id = 'play_pcd';

export function PlayTabs() {

  const [tabValue, setTabValue] = React.useState(0);
  const [showContent, setShowContent] = React.useState(true);
  const [state, setState] = React.useState({
    progress0: 0,
    progress1: 0,
    disabled0: 0,
    disabled1: 0,
    processCount0: 0
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      stopPlayClick(1);
    }
    if (newValue === 1) {
      stopPlayClick(0);
    }
  };

  const startPlayClick = (tabIndex) => {
    if (tabIndex === 0) {
      state.disabled0 = 1;
      setShowContent(false);
      //startPcdPlay(play_pcd_id, playAreaHeight, pcds, state, setState);
      playPcd(play_pcd_id, playAreaHeight, pcds, state, setState);
    }
    if (tabIndex === 1) {
      state.disabled1 = 1;
      startDracoPlay(state, setState, interval);
    }
  };

  const stopPlayClick = (tabIndex) => {
    if (tabIndex === 0) {
      setState({ ...state, 'disabled0': 0 });
    }
    if (tabIndex === 1) {
      setState({ ...state, 'disabled1': 0 });
      clearInterval(interval['interval1']);
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
          <AlertTitle><b>pcd</b>播放</AlertTitle>
          <Typography gutterBottom>
            直接播放<b>pcd</b>点云文件，传输过程中数据包体积较大<br />
            当前共有<b>{pcds.total}</b>个点云文件，当前处理到第<b>{state.processCount0}</b>个
          </Typography>
          &nbsp;<PlayButton index={0} size="small" disabled={state.disabled0} onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={0} size="small" color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <LinearProgress variant="determinate" value={state.progress0} color="success" sx={{ my: '10px' }} />
        <PlayArea id={play_pcd_id} content="直接播放Pcd" minHeight={playAreaHeight} showContent={showContent} />
      </PlayTabPanel>
      <PlayTabPanel value={tabValue} index={1}>
        <Alert severity="info" icon={false}>
          <AlertTitle><b>drc</b>播放</AlertTitle>
          <Typography gutterBottom>
            利用<b>Draco</b>将<b>pcd</b>文件转化为<b>drc</b>文件进行播放，减少传输过程中的数据包体积大小
          </Typography>
          &nbsp;<PlayButton index={1} disabled={state.disabled1} onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={1} size="small" color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <LinearProgress variant="determinate" value={state.progress1} color="success" sx={{ my: '10px' }} />
      </PlayTabPanel>
    </Box >
  );
}