import React, { useState } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	Alert,
	ScrollView,
	KeyboardAvoidingView
} from 'react-native';

import MyTextInput from "../components/MyTextInput";
import MyButton from "../components/MyButton";

import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: "UserDatabase.db"})

const UpdateUser = ({ navigation }) => {

	let [userId, setUserId] = useState('');
	let [userName, setUserName] = useState('');
	let [userEmail, setUserEmail] = useState('');
	let [userNumber, setUserNumber] = useState('');

	function atualizar_estados(name, email, number){
		setUserName(name);
		setUserEmail(email);
		setUserNumber(number.toString());
	}

	
	
	function procurar_usuario(){
		console.log(userId);

		db.transaction((tx) => {
			tx.executeSql(
				'SELECT * FROM table_user WHERE user_id = ?',
				[userId],
				(tx, results) => {
					var len = results.rows.length;
					if(len > 0){
						let res = results.rows.item(0);
						console.log(res);
						atualizar_estados(res.user_name, res.user_email, res.user_number);
					}	else {
						atualizar_estados('', '', '');
					}
				}
			)
		})
	}

	function atualizar_usuario(){
		console.log(userId, userName, userEmail, userNumber);

		if(!userId) {
			alert('Procure um Id');
			return;
		}
		if(!userName) {
			alert('Preencha o Nome');
			return;
		}
		if(!userEmail) {
			alert('Preencha o Email');
			return;
		}
		if(!userNumber) {
			alert('Preencha o Numero');
			return;
		}

		db.transaction((tx) => {
			tx.executeSql(
				'UPDATE table_user SET user_name=?, user_email=?, user_number=? WHERE user_id=?',
				[userName, userEmail, userNumber, userId],
				(tx, results) => {
						console.log(results.rowsAffected);
						if(results.rowsAffected > 0){
							Alert.alert(
							'Sucesso',
							'Contato atualizado com sucesso',
							[
								{
									text: 'Ok',
									onPress: () => navigation.navigate('HomeScreen')
								}
							],
							{ cancelable: false }
						)
					}	else {
						alert('Erro na atualização')
					}
				},
				function (error) {console.log(error);}
			)
		})
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<View style={{ flex: 1}}>
					<ScrollView KeyboardShouldPersistTaps= "handled">
						<KeyboardAvoidingView
							behavior="padding"
							style={{ flex: 1, justifyContent: 'space-between'}}
						>
							<MyTextInput 
								placeholder="Procure um Id"
								onChangeText={(userId) => setUserId(userId)}
								keyboardType="numeric"
								style={{ padding: 10 }}
							/>
							<MyButton
								title="Procurar"
								onClick={procurar_usuario}
							/>
							<MyTextInput 
								placeholder="Nome"
								onChangeText={(userName) => setUserName(userName)}
								value={userName}
								style={{ padding: 10 }}
							/>
							<MyTextInput 
								placeholder="Email"
								onChangeText={(userEmail) => setUserEmail(userEmail)}
								value={userEmail}
								style={{ padding: 10 }}
							/>
							<MyTextInput 
								value={userNumber}
								placeholder="Numero"
								onChangeText={(userNumber) => setUserNumber(userNumber)}
								maxLength={12}
								style={{ padding: 10 }}
							/>
							<MyButton
								title="Atualizar"
								onClick={atualizar_usuario}
							/>
						</ KeyboardAvoidingView>
					</ ScrollView>
				</ View>
			</ View>
		</ SafeAreaView>
	)
};

export default UpdateUser;