import { dummyCart, dummyWishlist } from "@/assets/assets";
import { Product,  } from "@/constants/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


export type CartItem = {
    id: string;
    productId: string;
    product: Product;
    quantity: number;
    size: string;
    price: number;
}


type CartContextType = {
    cartItems: CartItem[],
    addToCart: (product: Product, size: string)=> Promise<void>;
    removeFromCart: (itemId: string, size: string)=> Promise<void>;
    updateQuantity: (itemId: string, quantity: number,size: string )=> Promise<void>;
    clearCart: ()=> Promise<void>;
    cartTotal: number;
    itemCount: number;
    isLoading: boolean;

}
const cartContext = createContext< CartContextType | undefined>(undefined)

export function CartProvider({children}: {children: ReactNode}){
    

    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0)

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const serverCart = dummyCart;
            const mappedItems: CartItem[] = serverCart.items.map((item: any)=>({
                id: item.product._id,
                productId: item.product._id,
                product: item.product,
                quantity: item.quantity,
                size: item?.size || 'M',
                price: item.price
            }));
            setCartItems(mappedItems);
            setCartTotal(serverCart.totalAmount);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setCartItems([]);
            setCartTotal(0);
        } finally {
            setIsLoading(false);
        }
    }

    const  addToCart = async (product: Product, size: string) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product._id && item.size === size);
            let newItems: CartItem[];
            
            if (existingItem) {
                newItems = prevItems.map(item =>
                    item.id === product._id && item.size === size
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...prevItems, {
                    id: product._id,
                    productId: product._id,
                    product,
                    quantity: 1,
                    size,
                    price: product.price
                }];
            }
            
            const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setCartTotal(total);
            return newItems;
        });
    }

    const  removeFromCart = async (productId: string, size: string) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => !(item.id === productId && item.size === size));
            const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setCartTotal(total);
            return newItems;
        });
    }

    const  updateQuantity = async (productId: string, quantity: number, size: string = 'M') => {
        if (quantity <= 0) {
            return removeFromCart(productId, size);
        }
        
        setCartItems(prevItems => {
            const newItems = prevItems.map(item =>
                item.id === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            );
            const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setCartTotal(total);
            return newItems;
        });
    }

    const clearCart = async() => {
        setCartItems([]);
        setCartTotal(0);
    }

    const itemCount = cartItems.reduce((sum, item)=> sum + item.quantity, 0)

    useEffect(()=>{
        fetchCart()
    },[])

    return(
        <cartContext.Provider value={{cartItems, addToCart, removeFromCart, updateQuantity , clearCart, cartTotal, itemCount, isLoading }}>
           {children}
        </cartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(cartContext);
    if (context === undefined) {
        // Return safe defaults instead of throwing
        return {
            cartItems: [],
            addToCart: async () => {},
            removeFromCart: async () => {},
            updateQuantity: async () => {},
            clearCart: async () => {},
            cartTotal: 0,
            itemCount: 0,
            isLoading: false,
        };
    }
    return context
}