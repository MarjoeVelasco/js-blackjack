export {BGM, CLICK, SWIPE, WIN, LOSE};




const AUDIO_DIR = 'assets/audio/';

const BGM = new Audio(`${AUDIO_DIR}bgm.mp3`);
const CLICK = new Audio(`${AUDIO_DIR}button_click.mp3`);
const SWIPE = new Audio(`${AUDIO_DIR}card_flick.mp3`);
const WIN = new Audio(`${AUDIO_DIR}win_chimes.mp3`);
const LOSE = new Audio(`${AUDIO_DIR}lose_whistle.mp3`);