import React, {useState, useCallback, useEffect} from 'react';
import { View,StyleSheet, Text, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons'
import TaskList from './src/components/TaskList/Index';
import * as Animatable from 'react-native-animatable';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {

      const [task, setTask] = useState([]);
      const [open, setOpen] = useState(false);
      const [input, setInput] = useState('');


        //armarzenar as tarefas 
        useEffect(() => {
          
         async function loadTasks(){
            const taskStorage = await AsyncStorage.getItem('@task')

            if(taskStorage){
              setTask(JSON.parse(taskStorage));
            }
          }

          loadTasks();
        }, []);

        //Função de monitoramento, caso tenha sofrido alguma alteração

        useEffect(() => {
          async function saveTasks(){
            await AsyncStorage.setItem('@task', JSON.stringify(task));
          }

          saveTasks();
        }, [task]);

      // função para listar minhas tarefas
      function handleAdd(){
        if (input === '') return;

        const data = {
          key: input,
          task: input
        }

        setTask([...task, data]);
        setOpen(false);
        setInput('');
        
      }
        //Detelar tarefas
      const handleDelete = useCallback((data) => {
        const find = task.filter(r => r.key !== data.key);
        setTask(find); 
      })

  return (
    <SafeAreaView style = {styles.container}>
      <StatusBar backgroundColor = '#171d31' barStyle = "light-content" />

      <View style = {styles.content}> 
      <Text style = {styles.title}> Minhas Tarefas </Text>
      </View>

      <FlatList 
       marginHorizontal = {10}
       showsHorizontalScrollIndicator = {false}
       data = {task}
       keyExtractor = { (item) => String(item.key)}
       renderItem = { ({item}) => <TaskList data = {item} handleDelete = {handleDelete}/> }
      />

     <Modal animationType = "slide" transparent = {false} visible = {open}>
        <SafeAreaView style = {styles.modal}>

          <View style = {styles.modalHeader}>
            <TouchableOpacity onPress = { () => setOpen(false)}>
              <Ionicons style = {{marginLeft: 5, marginRight: 5}} name= "md-arrow-back" size = {40} color="#FFF"/>
            </TouchableOpacity>
            <Text style = {styles.modalTitle}> Nova Tarefa </Text>
          </View>

          <Animatable.View style = {styles.modalBody} animation = "fadeInUp" useNativeDriver>
          <TextInput
          multiline = {true}
          placeholderTextColor = "#747474"
          autoCorrect = {false}
          placeholder = "O que você precisa fazer hoje?"
          style = {styles.input}
          value = {input}
          onChangeText = {(texto) => setInput(texto)}
          />

          <TouchableOpacity style = {styles.handleAdd} onPress={handleAdd}>
            <Text style = {styles.handleAddText}> Cadastrar </Text>
          </TouchableOpacity>
        </Animatable.View>

        </SafeAreaView>
     </Modal>

      <AnimatedBtn  
      style = {styles.fab}
      useNativeDriver
      animation = "bounceInUp"
      duration = {1500}
      onPress={ () => setOpen(true) }
      >
        <Ionicons name = "ios-add" size = {35} color = "#FFF" />
      </AnimatedBtn >
    </SafeAreaView>
  );
}

const styles =  StyleSheet.create({
  container:{
     flex: 1, 
     backgroundColor: '#171d31'
  },
  title:{
    color: '#FFF',
    fontSize: 25,
    margin: 15,
    textAlign: 'center',
    paddingBottom: 10,
  },
  fab:{
    position: 'absolute',
    width: 60,
    height: 60, 
    backgroundColor: '#0094FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height:3,
    }
  },
  modal:{
    flex: 1, 
    backgroundColor: '#171d31',
  },
  modalHeader:{
    margin: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle:{
    marginLeft: 15,
    fontSize: 23,
    color: '#FFF'
  },
  modalBody:{
    marginTop: 15,
  },
  input:{
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#FFF',
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,
  },
  handleAdd:{
    backgroundColor: '#FFF',
    marginTop : 10 ,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5
  },
  handleAddText:{
    fontSize: 20,
  }
})





