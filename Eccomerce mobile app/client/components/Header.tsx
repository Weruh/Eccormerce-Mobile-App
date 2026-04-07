import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { HeaderProps } from '@/constants/types'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useCart } from '@/context/CartContext'

export default function Header({title, showBack, showSearch, showCart, showMenu, showLogo} : HeaderProps) {

  const router = useRouter()
  const { itemCount } = useCart()

  return (
    <View className='flex-row items-center justify-between px-4 mb-2 py-2 bg-white '>
        {/* left side */}
        <View className='flex-row items-center flex-1'>
            {showBack && (
              <TouchableOpacity onPress={()=> router.back()} className='mr-3'>
                <Ionicons name='arrow-back' size={24} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            
            {showMenu && (
              <TouchableOpacity className='mr-3 ' disabled>
                <Ionicons name='menu-outline' className='mt-4' size={32} color={COLORS.primary} />
              </TouchableOpacity>
            )}

            {showLogo ? (
              <View className='flex-1  items-center justify-center'>
                 <Image source={require ("@/assets/logo.png")} style={{width: "100%", height: 24 }} resizeMode='contain' />
              </View>
            ) : title &&  ( <Text className='text-xl font-bold  text-primary text-center flex-1 mr-8'>
               {title}
            </Text>)}

            {(!title && !showSearch ) && <View className='flex-1'></View>}

        </View>
        {/* right side */}
        <View className='flex-row items-center gap-4'>
            {showSearch && (
              <TouchableOpacity onPress={() => {/* TODO: Implement search */}}>
                  <Ionicons name='search-outline' size={24} color={COLORS.primary}/>
              </TouchableOpacity>)}  

              {showCart && (
              <TouchableOpacity onPress={()=> router.push('/cart')}>
                <View className='relative'>
                   <Ionicons name='bag-outline' size={24} color={COLORS.primary}/>
                <View className='absolute -top-1 -right-1 bg-accent w-4 h-4 rounded-full items-center justify-center'>
                    <Text className='text-white text-[10px]  font-bold'>{itemCount} </Text>
                </View>
                </View>
                  
              </TouchableOpacity>)}
        </View>
      
    </View>
  )
}
