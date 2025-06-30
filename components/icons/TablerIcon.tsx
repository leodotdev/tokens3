import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// Import icon sets from react-native-vector-icons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

// Tabler-style icon mappings using available icon sets
export type TablerIconName = 
  // Navigation & UI
  | 'home' | 'search' | 'plus' | 'x' | 'menu' | 'dots-vertical' | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down'
  // Shopping & Products
  | 'shopping-bag' | 'shopping-cart' | 'heart' | 'star' | 'tag' | 'gift'
  // User & Profile
  | 'user' | 'users' | 'user-plus' | 'settings' | 'logout' | 'login' | 'profile'
  // Communication
  | 'message' | 'mail' | 'phone' | 'calendar' | 'clock' | 'bell'
  // Actions
  | 'edit' | 'trash' | 'check' | 'close' | 'save' | 'share' | 'copy' | 'download' | 'upload'
  // Arrows & Directions
  | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'arrow-down' | 'external-link'
  // Media & Files
  | 'photo' | 'file' | 'folder' | 'camera' | 'video' | 'music'
  // System
  | 'info' | 'alert' | 'help' | 'lock' | 'unlock' | 'eye' | 'eye-off' | 'loading'
  // Theme
  | 'sun' | 'moon' | 'device-desktop' | 'monitor';

interface TablerIconProps {
  name: TablerIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

// Icon mapping - using the best available icons from different sets to create Tabler-like appearance
const iconMapping: Record<TablerIconName, { set: string; name: string }> = {
  // Navigation & UI
  'home': { set: 'Feather', name: 'home' },
  'search': { set: 'Feather', name: 'search' },
  'plus': { set: 'Feather', name: 'plus' },
  'x': { set: 'Feather', name: 'x' },
  'menu': { set: 'Feather', name: 'menu' },
  'dots-vertical': { set: 'Feather', name: 'more-vertical' },
  'chevron-left': { set: 'Feather', name: 'chevron-left' },
  'chevron-right': { set: 'Feather', name: 'chevron-right' },
  'chevron-up': { set: 'Feather', name: 'chevron-up' },
  'chevron-down': { set: 'Feather', name: 'chevron-down' },
  
  // Shopping & Products
  'shopping-bag': { set: 'Feather', name: 'shopping-bag' },
  'shopping-cart': { set: 'Feather', name: 'shopping-cart' },
  'heart': { set: 'Feather', name: 'heart' },
  'star': { set: 'Feather', name: 'star' },
  'tag': { set: 'Feather', name: 'tag' },
  'gift': { set: 'Feather', name: 'gift' },
  
  // User & Profile
  'user': { set: 'Feather', name: 'user' },
  'users': { set: 'Feather', name: 'users' },
  'user-plus': { set: 'Feather', name: 'user-plus' },
  'settings': { set: 'Feather', name: 'settings' },
  'logout': { set: 'Feather', name: 'log-out' },
  'login': { set: 'Feather', name: 'log-in' },
  'profile': { set: 'Feather', name: 'user' },
  
  // Communication
  'message': { set: 'Feather', name: 'message-circle' },
  'mail': { set: 'Feather', name: 'mail' },
  'phone': { set: 'Feather', name: 'phone' },
  'calendar': { set: 'Feather', name: 'calendar' },
  'clock': { set: 'Feather', name: 'clock' },
  'bell': { set: 'Feather', name: 'bell' },
  
  // Actions
  'edit': { set: 'Feather', name: 'edit-2' },
  'trash': { set: 'Feather', name: 'trash-2' },
  'check': { set: 'Feather', name: 'check' },
  'close': { set: 'Feather', name: 'x' },
  'save': { set: 'Feather', name: 'save' },
  'share': { set: 'Feather', name: 'share' },
  'copy': { set: 'Feather', name: 'copy' },
  'download': { set: 'Feather', name: 'download' },
  'upload': { set: 'Feather', name: 'upload' },
  
  // Arrows & Directions
  'arrow-left': { set: 'Feather', name: 'arrow-left' },
  'arrow-right': { set: 'Feather', name: 'arrow-right' },
  'arrow-up': { set: 'Feather', name: 'arrow-up' },
  'arrow-down': { set: 'Feather', name: 'arrow-down' },
  'external-link': { set: 'Feather', name: 'external-link' },
  
  // Media & Files
  'photo': { set: 'Feather', name: 'image' },
  'file': { set: 'Feather', name: 'file' },
  'folder': { set: 'Feather', name: 'folder' },
  'camera': { set: 'Feather', name: 'camera' },
  'video': { set: 'Feather', name: 'video' },
  'music': { set: 'Feather', name: 'music' },
  
  // System
  'info': { set: 'Feather', name: 'info' },
  'alert': { set: 'Feather', name: 'alert-triangle' },
  'help': { set: 'Feather', name: 'help-circle' },
  'lock': { set: 'Feather', name: 'lock' },
  'unlock': { set: 'Feather', name: 'unlock' },
  'eye': { set: 'Feather', name: 'eye' },
  'eye-off': { set: 'Feather', name: 'eye-off' },
  'loading': { set: 'Feather', name: 'loader' },
  
  // Theme
  'sun': { set: 'Feather', name: 'sun' },
  'moon': { set: 'Feather', name: 'moon' },
  'device-desktop': { set: 'Feather', name: 'monitor' },
  'monitor': { set: 'Feather', name: 'monitor' },
};

export const TablerIcon: React.FC<TablerIconProps> = ({
  name,
  size = 24,
  color = '#000000',
  style
}) => {
  const iconConfig = iconMapping[name];
  
  if (!iconConfig) {
    console.warn(`TablerIcon: Icon "${name}" not found, falling back to "help"`);
    return <Feather name="help-circle" size={size} color={color} style={style} />;
  }

  const { set, name: iconName } = iconConfig;

  // Render the appropriate icon from the correct set
  switch (set) {
    case 'AntDesign':
      return <AntDesign name={iconName} size={size} color={color} style={style} />;
    case 'Entypo':
      return <Entypo name={iconName} size={size} color={color} style={style} />;
    case 'EvilIcons':
      return <EvilIcons name={iconName} size={size} color={color} style={style} />;
    case 'Feather':
      return <Feather name={iconName} size={size} color={color} style={style} />;
    case 'FontAwesome':
      return <FontAwesome name={iconName} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName} size={size} color={color} style={style} />;
    case 'Foundation':
      return <Foundation name={iconName} size={size} color={color} style={style} />;
    case 'Ionicons':
      return <Ionicons name={iconName} size={size} color={color} style={style} />;
    case 'MaterialIcons':
      return <MaterialIcons name={iconName} size={size} color={color} style={style} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconName} size={size} color={color} style={style} />;
    case 'Octicons':
      return <Octicons name={iconName} size={size} color={color} style={style} />;
    case 'SimpleLineIcons':
      return <SimpleLineIcons name={iconName} size={size} color={color} style={style} />;
    case 'Zocial':
      return <Zocial name={iconName} size={size} color={color} style={style} />;
    default:
      return <Feather name="help-circle" size={size} color={color} style={style} />;
  }
};