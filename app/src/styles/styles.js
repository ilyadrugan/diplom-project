import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const iconSize = 40;
const styles = StyleSheet.create({
  containerViewShot: {
    width: windowWidth,
    height: windowHeight,
  },
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: windowWidth,
  },
  containerCenterRow: {
    width: 0.9 * windowWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerRowStart: {
    width: 0.9 * windowWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  containerRowStartPen: {
    width: 0.9 * windowWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerSpaceAround: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    width: windowWidth,
  },
  icon: {
    height: iconSize,
    width: iconSize,
    borderColor: '#000000',
    position: 'absolute',
  },
  ramkastyle: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  textInputStyle: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 6,
    width: 0.9 * windowWidth,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  formsStyle: {
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    width: 0.9 * windowWidth,
    height: 40,
    marginVertical: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    borderRadius: 6,
  },
  cameraLayout: {
    width: windowWidth,
    height: windowHeight,
  },
  containerCamera: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    width: windowWidth,
    alignItems: 'center',
  },
  exit:{
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    margin: 10,
    left: 10,
    borderRadius: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  flash: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    left: 10,
    position: 'absolute',
  },
  connectorContainer: {
    position: 'absolute',
    bottom: 10,
    zIndex: 2,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  connectorButton: {
    bottom: 10,
    width: 160,
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderColor: 'black',
    borderWidth: 2,
  },
  editor: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    margin: 20,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    width: 100,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    margin: 20,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 4,
  },
  smallImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: windowWidth * 0.95,
    marginBottom: 10,
  },
  textCoordsFields: {
    fontSize: 16,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    bottom:16
  },
  modalText: {
    fontSize: 18,
    overflow: 'hidden',
    padding: 10,
    color: 'black',
  },
  warningText:{
    color:'#ffcc00',
    fontSize:16,
    textShadowColor: 'rgba(0, 0, 0)',
    textShadowOffset: {width: -1, height: 1}
  },
  commentMaxWidth:{
    maxWidth:windowWidth*0.5
  },
  modalTextString: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  modalBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '95%',
  },
  modalButton: {
    width: '48%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10,
    margin:6,
  },
});

export default styles;
