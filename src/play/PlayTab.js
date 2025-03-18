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

import { loadDataInfo } from './playFunc';
import { playPcd } from './playPcd'
import { playDrc } from './playDrc'

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

let pcds = await loadDataInfo('http://127.0.0.1:8000/main/listPcdFiles');
let drcs = await loadDataInfo('http://127.0.0.1:8000/main/listDrcFiles');

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

const { innerHeight: height } = window;
const playAreaHeight = height - 240;
const play_pcd_id = 'play_pcd', play_drc_id = 'play_drc';

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
    processCount: 0
  });
  const [playing1, setPlaying1] = React.useState(false);
  const playing1Ref = React.useRef(playing1);

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
    setShowContent(false);
    if (tabIndex === 0) {
      setPlaying0(true);
      playPcd(play_pcd_id, playAreaHeight, pcds, playing0Ref, setState0);
    }
    if (tabIndex === 1) {
      setPlaying1(true);
      playDrc(play_drc_id, playAreaHeight, drcs, playing1Ref, setState1);
    }
  };

  const stopPlayClick = (tabIndex) => {
    if (tabIndex === 0) {
      setPlaying0(false);
    }
    if (tabIndex === 1) {
      setPlaying1(false);
    }
  };

  React.useEffect(() => {
    playing0Ref.current = playing0;
  }, [playing0]);

  React.useEffect(() => {
    playing1Ref.current = playing1;
  }, [playing1]);

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
        <PlayArea id={play_pcd_id} content="直接播放Pcd文件" minHeight={playAreaHeight} showContent={showContent} />
      </PlayTabPanel>

      <PlayTabPanel value={tabValue} index={1}>
        <Alert severity="info" icon={false}>
          <AlertTitle><b>drc</b>播放</AlertTitle>
          <Typography gutterBottom>
            利用<b>Draco</b>将<b>pcd</b>文件转化为<b>drc</b>文件进行播放，减少传输过程中的数据包体积大小<br />
            当前共有<b>{pcds.total}</b>个点云文件，当前处理到第<b>{state1.processCount}</b>个
          </Typography>
          &nbsp;<PlayButton index={1} size="small" playing={playing1} onClick={startPlayClick} name='播放' />
          &nbsp;<PlayButton index={1} size="small" playing={!playing1} color="info" onClick={stopPlayClick} name='暂停' />
        </Alert>
        <LinearProgress variant="determinate" value={state1.progress} color="success" sx={{ my: '10px' }} />
        <PlayArea id={play_drc_id} content="通过Drc解码播放" minHeight={playAreaHeight} showContent={showContent} />
      </PlayTabPanel>
    </Box >
  );
}