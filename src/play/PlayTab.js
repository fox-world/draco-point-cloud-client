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

  const [state0, setState0] = React.useState({
    progress: 0,
    processCount: 0
  });

  const [playing0, setPlaying0] = React.useState(false);
  const playing0Ref = React.useRef(playing0);

  const [state1, setState1] = React.useState({
    progress: 0,
    disabled: 0,
    processCount: 0
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
      setShowContent(false);
      setPlaying0(true);
      playPcd(play_pcd_id, playAreaHeight, pcds, playing0Ref, setState0);
    }
    if (tabIndex === 1) {
      state1.disabled = 1;
      startDracoPlay(state1, setState1, interval);
    }
  };

  const stopPlayClick = (tabIndex) => {
    if (tabIndex === 0) {
      setPlaying0(false);
      setState0({ 'progress': 0, processCount: 0 });
    }
    if (tabIndex === 1) {
      setState1({ ...state1, 'disabled': 0 });
      clearInterval(interval['interval1']);
    }
  };

  React.useEffect(() => {
    playing0Ref.current = playing0;
  }, [playing0]);

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
            当前共有<b>{pcds.total}</b>个点云文件，当前处理到第<b>{state0.processCount}</b>个
          </Typography>
          &nbsp;<PlayButton index={0} size="small" playing={playing0} onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={0} size="small" playing={!playing0} color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <LinearProgress variant="determinate" value={state0.progress} color="success" sx={{ my: '10px' }} />
        <PlayArea id={play_pcd_id} content="直接播放Pcd" minHeight={playAreaHeight} showContent={showContent} />
      </PlayTabPanel>

      <PlayTabPanel value={tabValue} index={1}>
        <Alert severity="info" icon={false}>
          <AlertTitle><b>drc</b>播放</AlertTitle>
          <Typography gutterBottom>
            利用<b>Draco</b>将<b>pcd</b>文件转化为<b>drc</b>文件进行播放，减少传输过程中的数据包体积大小
          </Typography>
          &nbsp;<PlayButton index={1} onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={1} size="small" color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <LinearProgress variant="determinate" value={state1.progress} color="success" sx={{ my: '10px' }} />
      </PlayTabPanel>
    </Box >
  );
}