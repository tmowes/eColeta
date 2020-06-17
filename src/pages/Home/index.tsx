import React, { useState, useEffect } from 'react'
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'

import imgBackground from '../../assets/home-background.png'
import logo from '../../assets/logo.png'
import { IBGEUFResponse, IBGECityResponse } from './types'

const Home: React.FC = () => {
  const { navigate } = useNavigation()
  const [selectedUf, setSelectedUF] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    async function loadUFs() {
      const { data } = await axios.get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      )
      setUfs(data.map(uf => uf.sigla))
    }
    loadUFs()
  }, [])

  useEffect(() => {
    if (selectedUf === '0') return
    async function loadCities() {
      const { data } = await axios.get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      setCities(data.map(city => city.nome))
    }
    loadCities()
  }, [selectedUf])

  function handleNavigationToPoints() {
    navigate('Points', { uf: selectedUf, city: selectedCity })
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={imgBackground}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={logo} />
          <Text style={styles.title}>
            Seu marketplace de coleta de resíduos
          </Text>
          <Text style={styles.description}>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </Text>
        </View>
        <View style={styles.footer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{
              label: 'Escolha a UF',
              value: null,
              color: '#9EA0A4',
            }}
            onValueChange={value => {
              setSelectedUF(value)
            }}
            useNativeAndroidPickerStyle={false}
            items={ufs.map(uf => ({ label: uf, value: uf }))}
            Icon={() => {
              return <Icon name="chevron-down" color="#34CB79" size={24} />
            }}
          />
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{
              label: 'Escolha a cidade',
              value: null,
              color: '#9EA0A4',
            }}
            onValueChange={value => {
              setSelectedCity(value)
            }}
            useNativeAndroidPickerStyle={false}
            items={cities.map(city => ({ label: city, value: city }))}
            Icon={() => {
              return <Icon name="chevron-down" color="#34CB79" size={24} />
            }}
          />
          <RectButton style={styles.button} onPress={handleNavigationToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#ffffff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingRight: 30,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#6C6C80',
  },
  inputAndroid: {
    paddingRight: 30,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#6C6C80',
  },
  iconContainer: {
    top: 18,
    right: 12,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
})

export default Home
