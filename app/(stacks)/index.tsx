import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function InitialScreen() {
  return (
    <View>
      <Text>initial-screen</Text>
      <Link href="/modal">open modal</Link>
    </View>
  )
}

const styles = StyleSheet.create({})