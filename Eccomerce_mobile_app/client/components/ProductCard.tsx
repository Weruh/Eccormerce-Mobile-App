import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { memo } from 'react'
import { useRouter } from 'expo-router'
import { ProductCardProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useWishlist } from '@/context/WishlistContext'

// Use React.memo to prevent unnecessary re-renders when other items change
const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  const handlePress = () => {
    router.push(`/product/${product._id}`);
  };

  const handleWishlist = (e: any) => {
    // Crucial for nested buttons in React Native
    e.stopPropagation(); 
    toggleWishlist(product);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={handlePress}
      className='w-[48%] mb-4 bg-white rounded-lg overflow-hidden border border-gray-100'
    >
      <View className='relative h-56 w-full bg-gray-100'>
        <Image 
          source={{ uri: product.images?.[0] ?? 'https://via.placeholder.com/200' }} 
          className='w-full h-full' 
          resizeMode="cover"
        />

        {/* Favourite icon - Using Pressable for better nested interaction */}
        <Pressable 
          hitSlop={10} // Makes it easier to tap
          className='absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm' 
          onPress={handleWishlist}
        >
          <Ionicons 
            name={isLiked ? 'heart' : 'heart-outline'}  
            size={20} 
            color={isLiked ? COLORS.accent : COLORS.primary}
          />
        </Pressable>

        {/* Featured Badge */}
        {product.isFeatured && (
          <View className='absolute top-2 left-2 bg-black/70 px-2 py-1 rounded'>
            <Text className='text-white text-[10px] font-bold uppercase'>Featured</Text>
          </View>
        )}
      </View>
      
      {/* Product Info */}
      <View className='p-3'>
        {product.ratings?.average !== undefined && (
          <View className='flex-row items-center mb-1'>
            <Ionicons name='star' size={14} color='#FFD700' />
            <Text className='text-gray-500 text-xs ml-1'>
              {product.ratings.average.toFixed(1)}
            </Text>
          </View>
        )}
        
        <Text className='text-primary font-medium text-sm mb-1' numberOfLines={1}>
          {product.name}
        </Text>
        
        <View className='flex-row items-center'>
          <Text className='text-primary font-bold text-base'>
            ${(product.price ?? 0).toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default memo(ProductCard);