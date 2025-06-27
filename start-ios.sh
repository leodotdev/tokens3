#!/bin/bash

# Kill any existing Metro processes
echo "🔄 Cleaning up existing processes..."
lsof -ti:8081 | xargs kill -9 2>/dev/null
lsof -ti:19000 | xargs kill -9 2>/dev/null
lsof -ti:19001 | xargs kill -9 2>/dev/null

# Clear Metro cache
echo "🧹 Clearing Metro cache..."
npx expo start --clear

echo "
📱 To run on iOS:

1. Install 'Expo Go' app from the App Store on your iPhone
2. Open Camera app on your iPhone
3. Scan the QR code shown above
4. Tap the notification to open in Expo Go

Or press 'i' in this terminal to open iOS Simulator
"