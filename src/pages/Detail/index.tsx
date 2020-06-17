import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Linking,
} from 'react-native'
import { Feather as Icon, FontAwesome as FaIcon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import * as MailComposer from 'expo-mail-composer'
import api from '../../services/api'
import { Details, RouteParams } from './type'

const Detail: React.FC = () => {
  const [details, setDetails] = useState<Details>({} as Details)
  const { goBack } = useNavigation()
  const { params } = useRoute()
  const routeParams = params as RouteParams

  useEffect(() => {
    async function loadPointsParams(): Promise<void> {
      const { data } = await api.get(`points/${routeParams.point_id}`)
      setDetails(data)
    }
    loadPointsParams()
  }, [routeParams.point_id])

  function handleNavigateBack() {
    goBack()
  }
  function handleWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${details.point.whatsapp}&text=Tenho interesse sobre coleta de residuos.`,
    )
  }
  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [details.point.email],
    })
  }

  if (!details.point) {
    return null
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={24} color="#34CB79" />
        </TouchableOpacity>
        <Image
          source={{ uri: details.point.image_url }}
          style={styles.pointImage}
        />
        <Text style={styles.pointName}>{details.point.name}</Text>
        {details.items.map(item => (
          <Text key={item.title} style={styles.pointItems}>
            {item.title}
          </Text>
        ))}
        <View>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {`${details.point.city},${details.point.uf}`}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FaIcon name="whatsapp" color="#ffffff" size={20} />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" color="#ffffff" size={20} />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 32,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
})

export default Detail
