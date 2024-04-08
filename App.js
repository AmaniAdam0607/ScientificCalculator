import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Button, ImageBackground, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {

  const [userText, setUserText] = useState("");
  const [answerText, setAnswerText] = useState("Answer appears here.");
  const [loading, setLoading] = useState(false);

  /**This method fetch the answer for the given expression and operation using the newton api 
   * @function
   * @param {string} expression - the mathematical expression ( supports 'x' as the only variable)
   * @param {string} operation - any of ( 'derive', 'factor', 'simplify', 'integrate')
  */
  const fetchAnswer = async (expression, operation) => {

    console.log(`Expression ${expression}`);
    console.log(`Operation ${operation}`);
    try {
      setLoading(true);  
      const encodedURL = encodeURI(`https://newton.now.sh/api/v2/${operation}/${expression}`);
      console.log(encodedURL);
      const answerPayload = await fetch(encodedURL);
      console.log(answerPayload);
      const answer = await answerPayload.json();
      console.log(answer);
      setAnswerText(answer.result);
    }
    catch (e) {
      setAnswerText("Internet error.");
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  const runOperation = (operation) => {
    if (!userText) return;

    fetchAnswer(userText, operation);
  }



  return (
    <KeyboardAvoidingView behavior='padding' style={[styles.container, {flexDirection: 'column'}]}>
      <TextInput  value={userText} placeholder='Enter expression.' returnKeyType='done'  style={[styles.textInput, styles.textInputUser, styles.textInputCommon]}
      onChangeText={(enteredText) => {
        setUserText(enteredText);
      }}
      />
      {loading && (<ActivityIndicator style={[styles.textInput, styles.textInputAnswer, styles.textInputCommon]} />)}
      {!loading && (<TextInput placeholder={answerText} editable={false}  style={[styles.textInput, styles.textInputCommon,styles.textInputAnswer]}/>)}
      <View style={{flexDirection: 'row', width: 350, justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={()=>{ runOperation('derive') }} style={styles.button}>
          <Text style={styles.buttonText}>Derive</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{ runOperation('integrate') }} style={styles.button}>
          <Text style={styles.buttonText}>Integrate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{ runOperation('factor') }} style={styles.button}>
          <Text style={styles.buttonText}>Factor</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{ runOperation('simplify') }} style={styles.button}>
          <Text style={styles.buttonText}>Simplify</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 64, 
    width: 350,
    backgroundColor: 'floralwhite',
    fontSize: 25,
    padding: 10
  },
  textInputCommon: {
    borderColor: 'lightgrey',

    borderLeftWidth: 2,

    borderRightWidth: 2,
  },
  textInputAnswer: {

    borderBottomWidth: 2,

  },
  textInputUser: {

    borderTopWidth: 2,
  },
  button: {
    height: 40,
    backgroundColor: 'deepskyblue',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  },
  buttonText: {
    color: 'white',
  }
});
