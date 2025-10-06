import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatHeader } from './ChatHeaderME';
import { MessageList } from './MessageListME';
import { MessageInput } from './MessageInputME';
import { CallScreen } from './CallScreenME';
import type { FileMessage, TextMessage } from './MessageInputME';
import type { ChatContact } from './ChatHeaderME';

type MessageType = TextMessage | FileMessage;

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  fileInfo?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

interface ChatWindowProps {
  chatId: string;
  onBack: () => void;
  chatContact: ChatContact;
  onTabChange?: (tab: 'Chats' | 'Calls' | 'Help') => void;
  onCallStateChange?: (inCall: boolean, callType: 'voice' | 'video' | null) => void;
}

// Sample conversations for different chat IDs
const chatConversations: Record<string, Message[]> = {
  // Hrushi more - Customer
  '1': [
    { id: '1', text: 'Hi, I need help with my construction project', sender: 'other', timestamp: '10:00 AM', status: 'read' },
    { id: '2', text: 'Hello! I can definitely help. What do you need?', sender: 'me', timestamp: '10:02 AM', status: 'read' },
    { id: '3', text: 'I want to build a new house in Pune', sender: 'other', timestamp: '10:03 AM', status: 'read' },
    { id: '4', text: 'Great! Do you have the land ready?', sender: 'me', timestamp: '10:05 AM', status: 'read' },
    { id: '5', text: 'Yes, I have a 2000 sq ft plot in Wakad', sender: 'other', timestamp: '10:06 AM', status: 'read' },
    { id: '6', text: 'Perfect! What kind of house are you looking to build?', sender: 'me', timestamp: '10:07 AM', status: 'read' },
    { id: '7', text: 'I want a 3BHK modern style home', sender: 'other', timestamp: '10:08 AM', status: 'read' },
    { id: '8', text: 'Here are some 3BHK designs you might like', sender: 'me', timestamp: '10:10 AM', status: 'read', fileInfo: { name: '3bhk-designs.pdf', type: 'application/pdf', size: 2456789, url: '#' } },
    { id: '9', text: 'I like the 3rd design. How much will it cost?', sender: 'other', timestamp: '10:15 AM', status: 'read' },
    { id: '10', text: 'Approximately ₹45 lakhs including materials and labor', sender: 'me', timestamp: '10:16 AM', status: 'read' },
    { id: '11', text: 'That works. How long will it take?', sender: 'other', timestamp: '10:17 AM', status: 'read' },
    { id: '12', text: 'About 12-14 months for completion', sender: 'me', timestamp: '10:18 AM', status: 'read' },
    { id: '13', text: 'Can we meet this weekend to discuss further?', sender: 'other', timestamp: '10:20 AM', status: 'read' },
    { id: '14', text: 'Yes, Saturday at 11 AM works for me', sender: 'me', timestamp: '10:21 AM', status: 'read' },
    { id: '15', text: 'Perfect! I\'ll see you then', sender: 'other', timestamp: '10:22 AM', status: 'read' },
    { id: '16', text: 'Here\'s my office location', sender: 'me', timestamp: '10:23 AM', status: 'read', fileInfo: { name: 'location.jpg', type: 'image/jpeg', size: 1876543, url: 'https://source.unsplash.com/random/800x600/?office-building' } },
    { id: '17', text: 'Got it. Also, what materials will you be using?', sender: 'other', timestamp: '10:25 AM', status: 'read' },
    { id: '18', text: 'We use high-quality materials from trusted brands', sender: 'me', timestamp: '10:26 AM', status: 'read' },
    { id: '19', text: 'Here\'s a list of our standard materials', sender: 'me', timestamp: '10:27 AM', status: 'read', fileInfo: { name: 'materials-list.pdf', type: 'application/pdf', size: 1234567, url: '#' } },
    { id: '20', text: 'Looks good. Do you provide any warranty?', sender: 'other', timestamp: '10:30 AM', status: 'read' },
    { id: '21', text: 'Yes, 10 years on structure and 1 year on fittings', sender: 'me', timestamp: '10:31 AM', status: 'read' },
    { id: '22', text: 'That\'s great! I\'ll see you on Saturday', sender: 'other', timestamp: '10:32 AM', status: 'read' },
    { id: '23', text: 'Looking forward to it!', sender: 'me', timestamp: '10:33 AM', status: 'read' },
  ],

  // Subhas patil - Contractor
  '2': [
    { id: '1', text: 'Site progress update', sender: 'other', timestamp: '9:00 AM', status: 'read' },
    { id: '2', text: 'Please share the latest photos', sender: 'me', timestamp: '9:05 AM', status: 'read' },
    { id: '3', text: 'Sending now', sender: 'other', timestamp: '9:06 AM', status: 'read' },
    { id: '4', text: 'Foundation work completed today', sender: 'other', timestamp: '9:07 AM', status: 'read', fileInfo: { name: 'foundation1.jpg', type: 'image/jpeg', size: 1987654, url: 'https://source.unsplash.com/random/800x600/?construction' } },
    { id: '5', text: 'Looking good. What about the plinth beam?', sender: 'me', timestamp: '9:10 AM', status: 'read' },
    { id: '6', text: 'Starting tomorrow morning', sender: 'other', timestamp: '9:11 AM', status: 'read' },
    { id: '7', text: 'We need more cement', sender: 'other', timestamp: '9:12 AM', status: 'read' },
    { id: '8', text: 'How many bags?', sender: 'me', timestamp: '9:13 AM', status: 'read' },
    { id: '9', text: 'At least 50 bags', sender: 'other', timestamp: '9:14 AM', status: 'read' },
    { id: '10', text: 'I\'ll arrange for delivery by evening', sender: 'me', timestamp: '9:15 AM', status: 'read' },
    { id: '11', text: 'Also, the electrician needs to come tomorrow', sender: 'other', timestamp: '9:16 AM', status: 'read' },
    { id: '12', text: 'I\'ll schedule him for 10 AM', sender: 'me', timestamp: '9:17 AM', status: 'read' },
    { id: '13', text: 'Perfect. What about the tiles?', sender: 'other', timestamp: '9:18 AM', status: 'read' },
    { id: '14', text: 'I\'ll show you samples tomorrow', sender: 'me', timestamp: '9:19 AM', status: 'read' },
    { id: '15', text: 'Okay, also need to discuss labor payment', sender: 'other', timestamp: '9:20 AM', status: 'read' },
    { id: '16', text: 'I\'ll bring the payment tomorrow', sender: 'me', timestamp: '9:21 AM', status: 'read' },
    { id: '17', text: 'Thanks. Any changes to the plan?', sender: 'other', timestamp: '9:22 AM', status: 'read' },
    { id: '18', text: 'No, follow the approved plan', sender: 'me', timestamp: '9:23 AM', status: 'read' },
    { id: '19', text: 'Got it. Will send more updates tomorrow', sender: 'other', timestamp: '9:24 AM', status: 'read' },
    { id: '20', text: 'Looking forward to it', sender: 'me', timestamp: '9:25 AM', status: 'read' },
  ],

  // Teju shinde - Architect
  '3': [
    { id: '1', text: 'Hello, I need some design changes', sender: 'other', timestamp: '11:00 AM', status: 'read' },
    { id: '2', text: 'Hi Teju, what changes do you want to make?', sender: 'me', timestamp: '11:02 AM', status: 'read' },
    { id: '3', text: 'I want to add a small balcony to the master bedroom', sender: 'other', timestamp: '11:03 AM', status: 'read' },
    { id: '4', text: 'I can design that. Any specific size?', sender: 'me', timestamp: '11:04 AM', status: 'read' },
    { id: '5', text: 'About 8x6 feet', sender: 'other', timestamp: '11:05 AM', status: 'read' },
    { id: '6', text: 'Here\'s a quick sketch', sender: 'me', timestamp: '11:10 AM', status: 'read', fileInfo: { name: 'balcony-sketch.jpg', type: 'image/jpeg', size: 1876543, url: 'https://source.unsplash.com/random/800x600/?balcony' } },
    { id: '7', text: 'Looks good, but can we make it 10x8?', sender: 'other', timestamp: '11:15 AM', status: 'read' },
    { id: '8', text: 'Sure, I\'ll update the design', sender: 'me', timestamp: '11:16 AM', status: 'read' },
    { id: '9', text: 'Also, what about the railing design?', sender: 'other', timestamp: '11:17 AM', status: 'read' },
    { id: '10', text: 'Here are some railing options', sender: 'me', timestamp: '11:20 AM', status: 'read', fileInfo: { name: 'railing-options.pdf', type: 'application/pdf', size: 1234567, url: '#' } },
    { id: '11', text: 'I like the 3rd option', sender: 'other', timestamp: '11:25 AM', status: 'read' },
    { id: '12', text: 'Good choice. I\'ll update the 3D model', sender: 'me', timestamp: '11:26 AM', status: 'read' },
    { id: '13', text: 'When can I see the updated design?', sender: 'other', timestamp: '11:27 AM', status: 'read' },
    { id: '14', text: 'I\'ll send it by tomorrow evening', sender: 'me', timestamp: '11:28 AM', status: 'read' },
    { id: '15', text: 'Perfect, thanks!', sender: 'other', timestamp: '11:29 AM', status: 'read' },
    { id: '16', text: 'Also, we need to discuss the interior design', sender: 'me', timestamp: '11:30 AM', status: 'read' },
    { id: '17', text: 'Yes, I was thinking modern minimalist', sender: 'other', timestamp: '11:31 AM', status: 'read' },
    { id: '18', text: 'Here are some modern minimalist themes', sender: 'me', timestamp: '11:35 AM', status: 'read', fileInfo: { name: 'interior-themes.pdf', type: 'application/pdf', size: 2345678, url: '#' } },
    { id: '19', text: 'The 2nd theme looks amazing', sender: 'other', timestamp: '11:40 AM', status: 'read' },
    { id: '20', text: 'Great! I\'ll include it in the design', sender: 'me', timestamp: '11:41 AM', status: 'read' },
  ],

  // Channa ram - Cement Dealer
  '4': [
    { id: '1', text: 'Hello, need cement delivery', sender: 'me', timestamp: '10:00 AM', status: 'read' },
    { id: '2', text: 'Namaste, how many bags?', sender: 'other', timestamp: '10:02 AM', status: 'read' },
    { id: '3', text: '100 bags of UltraTech', sender: 'me', timestamp: '10:03 AM', status: 'read' },
    { id: '4', text: 'Current rate is ₹380 per bag', sender: 'other', timestamp: '10:04 AM', status: 'read' },
    { id: '5', text: 'That\'s higher than last time', sender: 'me', timestamp: '10:05 AM', status: 'read' },
    { id: '6', text: 'Yes, prices increased this week', sender: 'other', timestamp: '10:06 AM', status: 'read' },
    { id: '7', text: 'Can you do ₹360?', sender: 'me', timestamp: '10:07 AM', status: 'read' },
    { id: '8', text: 'Best I can do is ₹375', sender: 'other', timestamp: '10:08 AM', status: 'read' },
    { id: '9', text: 'Deal. When can you deliver?', sender: 'me', timestamp: '10:09 AM', status: 'read' },
    { id: '10', text: 'Tomorrow morning', sender: 'other', timestamp: '10:10 AM', status: 'read' },
    { id: '11', text: 'Please send the invoice', sender: 'me', timestamp: '10:11 AM', status: 'read' },
    { id: '12', text: 'Here it is', sender: 'other', timestamp: '10:12 AM', status: 'read', fileInfo: { name: 'invoice-4567.pdf', type: 'application/pdf', size: 123456, url: '#' } },
    { id: '13', text: 'Payment done', sender: 'me', timestamp: '10:15 AM', status: 'read' },
    { id: '14', text: 'Received, thanks. Driver will call before delivery', sender: 'other', timestamp: '10:16 AM', status: 'read' },
    { id: '15', text: 'Also, do you have waterproofing compound?', sender: 'me', timestamp: '10:17 AM', status: 'read' },
    { id: '16', text: 'Yes, Dr. Fixit available', sender: 'other', timestamp: '10:18 AM', status: 'read' },
    { id: '17', text: 'How much for 20kg?', sender: 'me', timestamp: '10:19 AM', status: 'read' },
    { id: '18', text: '₹1200 per can', sender: 'other', timestamp: '10:20 AM', status: 'read' },
    { id: '19', text: 'Send 2 cans with the cement', sender: 'me', timestamp: '10:21 AM', status: 'read' },
    { id: '20', text: 'Will do. Anything else?', sender: 'other', timestamp: '10:22 AM', status: 'read' },
  ],

  // Vikas Chavhan - Rental
  '5': [
    { id: '1', text: 'Hi, I need to rent a JCB', sender: 'me', timestamp: '2:00 PM', status: 'read' },
    { id: '2', text: 'For how many days?', sender: 'other', timestamp: '2:02 PM', status: 'read' },
    { id: '3', text: '3 days', sender: 'me', timestamp: '2:03 PM', status: 'read' },
    { id: '4', text: 'Rate is ₹1800 per day', sender: 'other', timestamp: '2:04 PM', status: 'read' },
    { id: '5', text: 'That works. When available?', sender: 'me', timestamp: '2:05 PM', status: 'read' },
    { id: '6', text: 'From tomorrow morning', sender: 'other', timestamp: '2:06 PM', status: 'read' },
    { id: '7', text: 'Perfect. Need operator?', sender: 'me', timestamp: '2:07 PM', status: 'read' },
    { id: '8', text: 'Yes, extra ₹1000 per day for operator', sender: 'other', timestamp: '2:08 PM', status: 'read' },
    { id: '9', text: 'Okay, please arrange', sender: 'me', timestamp: '2:09 PM', status: 'read' },
    { id: '10', text: '50% advance required', sender: 'other', timestamp: '2:10 PM', status: 'read' },
    { id: '11', text: 'Sent', sender: 'me', timestamp: '2:15 PM', status: 'read' },
    { id: '12', text: 'Received. Where to deliver?', sender: 'other', timestamp: '2:16 PM', status: 'read' },
    { id: '13', text: 'Site location shared', sender: 'me', timestamp: '2:17 PM', status: 'read', fileInfo: { name: 'location.jpg', type: 'image/jpeg', size: 1876543, url: 'https://source.unsplash.com/random/800x600/?map' } },
    { id: '14', text: 'Got it. Will be there by 8 AM', sender: 'other', timestamp: '2:18 PM', status: 'read' },
    { id: '15', text: 'Thanks. Fuel included?', sender: 'me', timestamp: '2:19 PM', status: 'read' },
    { id: '16', text: 'No, fuel extra', sender: 'other', timestamp: '2:20 PM', status: 'read' },
    { id: '17', text: 'Okay, no problem', sender: 'me', timestamp: '2:21 PM', status: 'read' },
    { id: '18', text: 'Please send your ID proof', sender: 'other', timestamp: '2:22 PM', status: 'read' },
    { id: '19', text: 'Here it is', sender: 'me', timestamp: '2:25 PM', status: 'read', fileInfo: { name: 'id-proof.pdf', type: 'application/pdf', size: 1234567, url: '#' } },
    { id: '20', text: 'All set. See you tomorrow', sender: 'other', timestamp: '2:26 PM', status: 'read' },
  ],
  // Rajesh Kumar - Sand Dealer
  '6': [
    { id: '1', text: 'Hi Rajesh, need river sand for construction', sender: 'me', timestamp: '9:00 AM', status: 'read' },
    { id: '2', text: 'Namaste! How many brass sand do you need?', sender: 'other', timestamp: '9:02 AM', status: 'read' },
    { id: '3', text: 'Need 5 brass. What\'s your rate?', sender: 'me', timestamp: '9:03 AM', status: 'read' },
    { id: '4', text: '₹8500 per brass including delivery', sender: 'other', timestamp: '9:05 AM', status: 'read' },
    { id: '5', text: 'That\'s higher than last time. Any discount for 5 brass?', sender: 'me', timestamp: '9:06 AM', status: 'read' },
    { id: '6', text: 'For you, ₹8300 per brass. Best rate', sender: 'other', timestamp: '9:07 AM', status: 'read' },
    { id: '7', text: 'Deal. When can you deliver?', sender: 'me', timestamp: '9:08 AM', status: 'read' },
    { id: '8', text: 'Tomorrow morning. Need any other materials?', sender: 'other', timestamp: '9:10 AM', status: 'read' },
    { id: '9', text: 'Yes, also need 200 bricks. Know any good dealers?', sender: 'me', timestamp: '9:12 AM', status: 'read' },
    { id: '10', text: 'I know Amit Joshi. Good quality bricks. Want his number?', sender: 'other', timestamp: '9:13 AM', status: 'read' },
    { id: '11', text: 'Yes please. Also, is the sand washed?', sender: 'me', timestamp: '9:15 AM', status: 'read' },
    { id: '12', text: 'Yes, double washed river sand. Purest quality', sender: 'other', timestamp: '9:16 AM', status: 'read' },
    { id: '13', text: 'Perfect. Please share the payment details', sender: 'me', timestamp: '9:17 AM', status: 'read' },
    { id: '14', text: '50% advance via UPI: 9876543210@upi', sender: 'other', timestamp: '9:18 AM', status: 'read' },
    { id: '15', text: 'Payment done. Transaction ID: TXN123456', sender: 'me', timestamp: '9:20 AM', status: 'read' },
    { id: '16', text: 'Received. Here\'s Amit\'s number: 9876543211', sender: 'other', timestamp: '9:21 AM', status: 'read' },
    { id: '17', text: 'Thanks. Will the driver have a challan?', sender: 'me', timestamp: '9:22 AM', status: 'read' },
    { id: '18', text: 'Yes, proper invoice and challan will be provided', sender: 'other', timestamp: '9:23 AM', status: 'read' },
    { id: '19', text: 'Great. Will wait for the delivery tomorrow', sender: 'me', timestamp: '9:24 AM', status: 'read' },
    { id: '20', text: 'Sure. Driver will call 30 mins before arrival', sender: 'other', timestamp: '9:25 AM', status: 'read' }
  ],

  // Amit Joshi - Bricks Dealer
  '7': [
    { id: '1', text: 'Hello Amit, Rajesh gave me your number', sender: 'me', timestamp: '10:00 AM', status: 'read' },
    { id: '2', text: 'Namaste! Yes, Rajesh told me. Need bricks?', sender: 'other', timestamp: '10:02 AM', status: 'read' },
    { id: '3', text: 'Yes, need 2000 bricks. What\'s your rate?', sender: 'me', timestamp: '10:03 AM', status: 'read' },
    { id: '4', text: '₹8 per brick for first class quality', sender: 'other', timestamp: '10:05 AM', status: 'read' },
    { id: '5', text: 'Can you do ₹7.50? I might need more later', sender: 'me', timestamp: '10:06 AM', status: 'read' },
    { id: '6', text: 'For 5000+ bricks, I can do ₹7.75', sender: 'other', timestamp: '10:08 AM', status: 'read' },
    { id: '7', text: 'Deal. Need 2000 now, more next week', sender: 'me', timestamp: '10:10 AM', status: 'read' },
    { id: '8', text: 'Okay. First load at ₹8, next at ₹7.75. Deal?', sender: 'other', timestamp: '10:12 AM', status: 'read' },
    { id: '9', text: 'Fair enough. When can you deliver?', sender: 'me', timestamp: '10:13 AM', status: 'read' },
    { id: '10', text: 'Tomorrow afternoon. Need any other materials?', sender: 'other', timestamp: '10:15 AM', status: 'read' },
    { id: '11', text: 'Actually, yes. Do you have cement as well?', sender: 'me', timestamp: '10:16 AM', status: 'read' },
    { id: '12', text: 'Yes, Ultratech Cement at ₹420 per bag', sender: 'other', timestamp: '10:17 AM', status: 'read' },
    { id: '13', text: 'Good price. Add 50 bags to the order', sender: 'me', timestamp: '10:18 AM', status: 'read' },
    { id: '14', text: 'Noted. 2000 bricks + 50 cement bags. Delivery charges ₹500', sender: 'other', timestamp: '10:20 AM', status: 'read' },
    { id: '15', text: 'Can you waive the delivery charge for this big order?', sender: 'me', timestamp: '10:21 AM', status: 'read' },
    { id: '16', text: 'Okay, free delivery this time', sender: 'other', timestamp: '10:22 AM', status: 'read' },
    { id: '17', text: 'Thanks! Please share payment details', sender: 'me', timestamp: '10:23 AM', status: 'read' },
    { id: '18', text: '50% advance. UPI: 9876543211@upi', sender: 'other', timestamp: '10:24 AM', status: 'read' },
    { id: '19', text: 'Sent ₹45,000. Please confirm', sender: 'me', timestamp: '10:25 AM', status: 'read' },
    { id: '20', text: 'Received. Will send truck details tomorrow morning', sender: 'other', timestamp: '10:26 AM', status: 'read' }
  ],
  
  // Suresh Yadav - Steel Dealer
  '8': [
    { id: '1', text: 'Namaste Suresh, need TMT bars for construction', sender: 'me', timestamp: '11:00 AM', status: 'read' },
    { id: '2', text: 'Jai Ram Ji Ki! Which grade and size do you need?', sender: 'other', timestamp: '11:02 AM', status: 'read' },
    { id: '3', text: 'Fe500D, 12mm and 16mm. What are your rates?', sender: 'me', timestamp: '11:03 AM', status: 'read' },
    { id: '4', text: '12mm ₹72/kg, 16mm ₹71/kg. Prices valid for 3 days', sender: 'other', timestamp: '11:05 AM', status: 'read' },
    { id: '5', text: 'That\'s higher than market rate. Can you match ₹70/kg?', sender: 'me', timestamp: '11:06 AM', status: 'read' },
    { id: '6', text: 'For 5+ MT, I can do ₹70.50 for both sizes', sender: 'other', timestamp: '11:08 AM', status: 'read' },
    { id: '7', text: 'Deal. Need 3 MT of 12mm and 3 MT of 16mm', sender: 'me', timestamp: '11:10 AM', status: 'read' },
    { id: '8', text: 'Good choice. Total 6 MT. Need any binding?', sender: 'other', timestamp: '11:12 AM', status: 'read' },
    { id: '9', text: 'Yes, please bind in 1 MT bundles', sender: 'me', timestamp: '11:13 AM', status: 'read' },
    { id: '10', text: 'Noted. Binding charges ₹500 per MT', sender: 'other', timestamp: '11:15 AM', status: 'read' },
    { id: '11', text: 'That\'s high. Can you include binding in the rate?', sender: 'me', timestamp: '11:16 AM', status: 'read' },
    { id: '12', text: 'Okay, ₹71/kg all inclusive. Final offer', sender: 'other', timestamp: '11:17 AM', status: 'read' },
    { id: '13', text: 'Deal. When can you deliver?', sender: 'me', timestamp: '11:18 AM', status: 'read' },
    { id: '14', text: 'Day after tomorrow. 50% advance needed', sender: 'other', timestamp: '11:20 AM', status: 'read' },
    { id: '15', text: 'Will transfer now. GST invoice, right?', sender: 'me', timestamp: '11:21 AM', status: 'read' },
    { id: '16', text: 'Yes, with 18% GST. Total ₹4,26,000', sender: 'other', timestamp: '11:22 AM', status: 'read' },
    { id: '17', text: 'Sent ₹2,13,000. Please confirm', sender: 'me', timestamp: '11:25 AM', status: 'read' },
    { id: '18', text: 'Received. Please share GST details for invoice', sender: 'other', timestamp: '11:26 AM', status: 'read' },
    { id: '19', text: 'GSTIN: 27ABCDE1234F1Z2. Send soft copy too', sender: 'me', timestamp: '11:27 AM', status: 'read' },
    { id: '20', text: 'Noted. Will email invoice after delivery', sender: 'other', timestamp: '11:28 AM', status: 'read' }
  ],
  
  // Prakash More - JCB Rental
  '9': [
    { id: '1', text: 'Namaste, need JCB for excavation work', sender: 'me', timestamp: '8:00 AM', status: 'read' },
    { id: '2', text: 'Namaskar! For how many days?', sender: 'other', timestamp: '8:02 AM', status: 'read' },
    { id: '3', text: '5 days, starting Monday', sender: 'me', timestamp: '8:03 AM', status: 'read' },
    { id: '4', text: 'Rate is ₹1800 per 8 hours, operator ₹1000 extra', sender: 'other', timestamp: '8:05 AM', status: 'read' },
    { id: '5', text: 'Need operator too. Any weekly discount?', sender: 'me', timestamp: '8:06 AM', status: 'read' },
    { id: '6', text: 'For 5+ days, ₹1700 per day with operator', sender: 'other', timestamp: '8:08 AM', status: 'read' },
    { id: '7', text: 'Deal. Need 2 JCBs for 5 days', sender: 'me', timestamp: '8:10 AM', status: 'read' },
    { id: '8', text: 'Noted. 50% advance required', sender: 'other', timestamp: '8:12 AM', status: 'read' },
    { id: '9', text: 'Sent ₹42,500. Please confirm', sender: 'me', timestamp: '8:15 AM', status: 'read' },
    { id: '10', text: 'Received. Fuel and maintenance extra', sender: 'other', timestamp: '8:16 AM', status: 'read' },
    { id: '11', text: 'Understood. Where to report Monday?', sender: 'me', timestamp: '8:17 AM', status: 'read' },
    { id: '12', text: 'My yard at 7 AM. Bring RC and PUC copies', sender: 'other', timestamp: '8:18 AM', status: 'read' },
    { id: '13', text: 'Will do. Any security deposit?', sender: 'me', timestamp: '8:19 AM', status: 'read' },
    { id: '14', text: 'Yes, ₹10,000 refundable deposit per machine', sender: 'other', timestamp: '8:20 AM', status: 'read' },
    { id: '15', text: 'That\'s fine. Sending deposit now', sender: 'me', timestamp: '8:22 AM', status: 'read' },
    { id: '16', text: 'Received. Here\'s the receipt', sender: 'other', timestamp: '8:23 AM', status: 'read', fileInfo: { name: 'receipt.pdf', type: 'application/pdf', size: 123456, url: '#' } },
    { id: '17', text: 'Thanks. Any other documents needed?', sender: 'me', timestamp: '8:24 AM', status: 'read' },
    { id: '18', text: 'Just Aadhar copy and 2 photos per operator', sender: 'other', timestamp: '8:25 AM', status: 'read' },
    { id: '19', text: 'Will bring everything on Monday', sender: 'me', timestamp: '8:26 AM', status: 'read' },
    { id: '20', text: 'Perfect. Call if any questions', sender: 'other', timestamp: '8:27 AM', status: 'read' }
  ],
  
  // Ganesh Patil - Crane Rental
  '10': [
    { id: '1', text: 'Need 50-ton crane for 2 days', sender: 'me', timestamp: '10:30 AM', status: 'read' },
    { id: '2', text: 'Available next week. Location?', sender: 'other', timestamp: '10:32 AM', status: 'read' },
    { id: '3', text: 'Pune-Mumbai Expressway, near Lonavala', sender: 'me', timestamp: '10:33 AM', status: 'read' },
    { id: '4', text: 'Rate is ₹25,000 per day, 8 hours', sender: 'other', timestamp: '10:35 AM', status: 'read' },
    { id: '5', text: 'Need it for 12 hours. Any package?', sender: 'me', timestamp: '10:36 AM', status: 'read' },
    { id: '6', text: 'For 12 hours, ₹35,000 per day', sender: 'other', timestamp: '10:38 AM', status: 'read' },
    { id: '7', text: 'What about fuel and operator?', sender: 'me', timestamp: '10:39 AM', status: 'read' },
    { id: '8', text: 'Included. Extra ₹5000 for night work', sender: 'other', timestamp: '10:40 AM', status: 'read' },
    { id: '9', text: 'Need it for day shift only', sender: 'me', timestamp: '10:41 AM', status: 'read' },
    { id: '10', text: 'Okay. 30% advance to book', sender: 'other', timestamp: '10:42 AM', status: 'read' },
    { id: '11', text: 'Sent ₹21,000. Please confirm', sender: 'me', timestamp: '10:45 AM', status: 'read' },
    { id: '12', text: 'Received. Send site location pin', sender: 'other', timestamp: '10:46 AM', status: 'read' },
    { id: '13', text: 'Location shared. Need safety certificate', sender: 'me', timestamp: '10:47 AM', status: 'read' },
    { id: '14', text: 'Will email certificate today', sender: 'other', timestamp: '10:48 AM', status: 'read' },
    { id: '15', text: 'Thanks. Any parking space needed?', sender: 'me', timestamp: '10:49 AM', status: 'read' },
    { id: '16', text: 'Yes, 30x30 feet clear area', sender: 'other', timestamp: '10:50 AM', status: 'read' },
    { id: '17', text: 'Noted. Will arrange it', sender: 'me', timestamp: '10:51 AM', status: 'read' },
    { id: '18', text: 'Operator will reach at 7 AM', sender: 'other', timestamp: '10:52 AM', status: 'read' },
    { id: '19', text: 'Perfect. Will be there to receive', sender: 'me', timestamp: '10:53 AM', status: 'read' },
    { id: '20', text: 'Please ensure ground is level', sender: 'other', timestamp: '10:54 AM', status: 'read' }
  ],
  
  // Mahesh Singh - Aggregate Dealer
  '11': [
    { id: '1', text: 'Need 20mm aggregate for RCC work', sender: 'me', timestamp: '9:15 AM', status: 'read' },
    { id: '2', text: 'How many brass? Need any sand?', sender: 'other', timestamp: '9:17 AM', status: 'read' },
    { id: '3', text: '30 brass aggregate, 20 brass sand', sender: 'me', timestamp: '9:18 AM', status: 'read' },
    { id: '4', text: 'Rate is ₹900/brass for aggregate, ₹850 for sand', sender: 'other', timestamp: '9:20 AM', status: 'read' },
    { id: '5', text: 'Can you do ₹850 and ₹800?', sender: 'me', timestamp: '9:21 AM', status: 'read' },
    { id: '6', text: 'For full truck (6 brass), ₹860 and ₹810', sender: 'other', timestamp: '9:23 AM', status: 'read' },
    { id: '7', text: 'Deal. Need delivery in 3 lots', sender: 'me', timestamp: '9:24 AM', status: 'read' },
    { id: '8', text: 'No problem. 30% advance', sender: 'other', timestamp: '9:25 AM', status: 'read' },
    { id: '9', text: 'Sent ₹15,000. When first delivery?', sender: 'me', timestamp: '9:28 AM', status: 'read' },
    { id: '10', text: 'Tomorrow morning. Need any test report?', sender: 'other', timestamp: '9:29 AM', status: 'read' },
    { id: '11', text: 'Yes, please provide lab test reports', sender: 'me', timestamp: '9:30 AM', status: 'read' },
    { id: '12', text: 'Will send with first load', sender: 'other', timestamp: '9:31 AM', status: 'read' },
    { id: '13', text: 'Can you supply 53 grade cement too?', sender: 'me', timestamp: '9:32 AM', status: 'read' },
    { id: '14', text: 'Yes, ₹410 per bag, min 100 bags', sender: 'other', timestamp: '9:33 AM', status: 'read' },
    { id: '15', text: 'Add 200 bags to the order', sender: 'me', timestamp: '9:34 AM', status: 'read' },
    { id: '16', text: 'Noted. Same delivery schedule?', sender: 'other', timestamp: '9:35 AM', status: 'read' },
    { id: '17', text: 'Yes, with first lot of material', sender: 'me', timestamp: '9:36 AM', status: 'read' },
    { id: '18', text: 'Driver will call 1 hour before', sender: 'other', timestamp: '9:37 AM', status: 'read' },
    { id: '19', text: 'Make sure material is clean', sender: 'me', timestamp: '9:38 AM', status: 'read' },
    { id: '20', text: '100% clean and washed material', sender: 'other', timestamp: '9:39 AM', status: 'read' }
  ],
  
  // Ravi Sharma - Customer
  '12': [
    { id: '1', text: 'Hi, I need help with house construction', sender: 'other', timestamp: '11:00 AM', status: 'read' },
    { id: '2', text: 'I can schedule that. What\'s the property address?', sender: 'me', timestamp: '10:05 AM', status: 'read' },
    { id: '3', text: '123 Main St. Here are the listing details', sender: 'other', timestamp: '10:06 AM', status: 'read', fileInfo: { name: 'listing.pdf', type: 'application/pdf', size: 1234567, url: '#' } }
  ],
  
  // Deepak Kale - Architect
  '13': [
    { id: '1', text: 'Good morning, I need an architect for my new house', sender: 'other', timestamp: '10:30 AM', status: 'read' },
    { id: '2', text: 'Good morning! I\'d be happy to help. What\'s the plot size and location?', sender: 'me', timestamp: '10:32 AM', status: 'read' },
    { id: '3', text: 'It\'s 2400 sq ft in Kothrud. Need 3BHK with modern design', sender: 'other', timestamp: '10:33 AM', status: 'read' },
    { id: '4', text: 'Great location! My fee is ₹50/sq ft. Here are some of my previous works', sender: 'me', timestamp: '10:35 AM', status: 'read', fileInfo: { name: 'portfolio.pdf', type: 'application/pdf', size: 2345678, url: '#' } },
    { id: '5', text: 'I like your designs. Can we meet to discuss requirements?', sender: 'other', timestamp: '10:38 AM', status: 'read' },
    { id: '6', text: 'Sure, I\'m available tomorrow after 4 PM. Your place or my office?', sender: 'me', timestamp: '10:40 AM', status: 'read' },
    { id: '7', text: 'Let\'s meet at my site. I\'ll share the location', sender: 'other', timestamp: '10:41 AM', status: 'read' },
    { id: '8', text: 'Perfect. What\'s your budget for construction?', sender: 'me', timestamp: '10:42 AM', status: 'read' },
    { id: '9', text: 'Around ₹75 lakhs. Need eco-friendly features', sender: 'other', timestamp: '10:43 AM', status: 'read' },
    { id: '10', text: 'That\'s workable. I\'ll prepare some concept sketches', sender: 'me', timestamp: '10:45 AM', status: 'read' },
    { id: '11', text: 'Also need Vastu compliance', sender: 'other', timestamp: '10:46 AM', status: 'read' },
    { id: '12', text: 'Noted. I\'ll ensure Vastu compliance in the design', sender: 'me', timestamp: '10:47 AM', status: 'read' },
    { id: '13', text: 'How long for initial plans?', sender: 'other', timestamp: '10:48 AM', status: 'read' },
    { id: '14', text: '2 weeks for initial concepts, then we can refine', sender: 'me', timestamp: '10:50 AM', status: 'read' },
    { id: '15', text: 'Okay. What documents do you need from me?', sender: 'other', timestamp: '10:51 AM', status: 'read' },
    { id: '16', text: 'Property papers, soil test report, and your must-haves list', sender: 'me', timestamp: '10:52 AM', status: 'read' },
    { id: '17', text: 'Will arrange everything. See you tomorrow', sender: 'other', timestamp: '10:53 AM', status: 'read' },
    { id: '18', text: 'Looking forward. My number is 9876543210', sender: 'me', timestamp: '10:54 AM', status: 'read' },
    { id: '19', text: 'Saved. I\'m Ramesh, by the way', sender: 'other', timestamp: '10:55 AM', status: 'read' },
    { id: '20', text: 'Nice to meet you, Ramesh. See you tomorrow!', sender: 'me', timestamp: '10:56 AM', status: 'read' }
  ],
  
  // Santosh Jadhav - Contractor
  '14': [
    { id: '1', text: 'Namaskar, need contractor for G+2 building', sender: 'other', timestamp: '11:30 AM', status: 'read' },
    { id: '2', text: 'Namaskar! Location and built-up area?', sender: 'me', timestamp: '11:32 AM', status: 'read' },
    { id: '3', text: 'Wakad, 4000 sq ft. Need quality work', sender: 'other', timestamp: '11:33 AM', status: 'read' },
    { id: '4', text: 'My rate is ₹1800/sq ft for premium quality. Here are similar projects', sender: 'me', timestamp: '11:35 AM', status: 'read', fileInfo: { name: 'projects.pdf', type: 'application/pdf', size: 3456789, url: '#' } },
    { id: '5', text: 'Can you do ₹1650?', sender: 'other', timestamp: '11:36 AM', status: 'read' },
    { id: '6', text: 'For quality materials and timely completion, ₹1750 is best I can do', sender: 'me', timestamp: '11:38 AM', status: 'read' },
    { id: '7', text: 'Okay, but need completion in 14 months', sender: 'other', timestamp: '11:39 AM', status: 'read' },
    { id: '8', text: 'Agreed, with ₹500/day penalty for delay. 10% advance', sender: 'me', timestamp: '11:41 AM', status: 'read' },
    { id: '9', text: 'Fair. Need material quality guarantee', sender: 'other', timestamp: '11:42 AM', status: 'read' },
    { id: '10', text: '5 years structural warranty. All material bills will be shared', sender: 'me', timestamp: '11:44 AM', status: 'read' },
    { id: '11', text: 'How many labors will work?', sender: 'other', timestamp: '11:45 AM', status: 'read' },
    { id: '12', text: '15-20 skilled laborers. Daily updates on WhatsApp', sender: 'me', timestamp: '11:46 AM', status: 'read' },
    { id: '13', text: 'Good. Need to see your license and GST', sender: 'other', timestamp: '11:47 AM', status: 'read' },
    { id: '14', text: 'Sharing all documents', sender: 'me', timestamp: '11:48 AM', status: 'read', fileInfo: { name: 'documents.zip', type: 'application/zip', size: 4567890, url: '#' } },
    { id: '15', text: 'Looks good. When can we start?', sender: 'other', timestamp: '11:50 AM', status: 'read' },
    { id: '16', text: 'Next Monday, after advance payment', sender: 'me', timestamp: '11:51 AM', status: 'read' },
    { id: '17', text: 'Will transfer today. Send account details', sender: 'other', timestamp: '11:52 AM', status: 'read' },
    { id: '18', text: 'Account details sent. Let me know once transferred', sender: 'me', timestamp: '11:53 AM', status: 'read' },
    { id: '19', text: 'Done. ₹12.6 lakhs transferred', sender: 'other', timestamp: '11:55 AM', status: 'read' },
    { id: '20', text: 'Received. Will share work schedule by evening', sender: 'me', timestamp: '11:56 AM', status: 'read' }
  ],
  
  // Kiran Desai - Rental
  '15': [
    { id: '1', text: 'Hi, saw your ad for mixer machine rental', sender: 'other', timestamp: '2:30 PM', status: 'read' },
    { id: '2', text: 'Hello! Yes, we have 10/7/5 cft mixers available. What capacity do you need?', sender: 'me', timestamp: '2:32 PM', status: 'read' },
    { id: '3', text: 'Need 10 cft for 15 days. What\'s the rate?', sender: 'other', timestamp: '2:33 PM', status: 'read' },
    { id: '4', text: '₹1200 per day, ₹15,000 for 15 days including operator', sender: 'me', timestamp: '2:35 PM', status: 'read' },
    { id: '5', text: 'Can you do ₹12,000?', sender: 'other', timestamp: '2:36 PM', status: 'read' },
    { id: '6', text: 'For 15+ days, best is ₹13,500 with GST', sender: 'me', timestamp: '2:38 PM', status: 'read' },
    { id: '7', text: 'Deal. Need it from 1st next month', sender: 'other', timestamp: '2:39 PM', status: 'read' },
    { id: '8', text: '50% advance to block the dates', sender: 'me', timestamp: '2:40 PM', status: 'read' },
    { id: '9', text: 'Okay. What about fuel and maintenance?', sender: 'other', timestamp: '2:41 PM', status: 'read' },
    { id: '10', text: 'Fuel is on you. We handle all maintenance', sender: 'me', timestamp: '2:43 PM', status: 'read' },
    { id: '11', text: 'Any security deposit?', sender: 'other', timestamp: '2:44 PM', status: 'read' },
    { id: '12', text: 'Yes, ₹20,000 refundable deposit', sender: 'me', timestamp: '2:45 PM', status: 'read' },
    { id: '13', text: 'That\'s high. Can we do ₹10,000?', sender: 'other', timestamp: '2:46 PM', status: 'read' },
    { id: '14', text: 'For regular customers, ₹15,000 is minimum', sender: 'me', timestamp: '2:48 PM', status: 'read' },
    { id: '15', text: 'Okay, deal. Where to collect?', sender: 'other', timestamp: '2:49 PM', status: 'read' },
    { id: '16', text: 'Our yard in Chakan. Sharing location', sender: 'me', timestamp: '2:50 PM', status: 'read', fileInfo: { name: 'location.jpg', type: 'image/jpeg', size: 1234567, url: '#' } },
    { id: '17', text: 'Got it. What are the working hours?', sender: 'other', timestamp: '2:51 PM', status: 'read' },
    { id: '18', text: '8 AM to 8 PM. Overtime charges apply after that', sender: 'me', timestamp: '2:53 PM', status: 'read' },
    { id: '19', text: 'Understood. Will transfer advance today', sender: 'other', timestamp: '2:54 PM', status: 'read' },
    { id: '20', text: 'Thanks! Will share payment details', sender: 'me', timestamp: '2:55 PM', status: 'read' }
  ]
};

export const ChatWindowME: React.FC<ChatWindowProps> = ({ 
  chatId, 
  onBack, 
  chatContact, 
  onTabChange,
  onCallStateChange 
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [activeCallType, setActiveCallType] = useState<'voice' | 'video' | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (chatId === 'helpline' || chatId === 'aichatbot') {
      return [];
    }
    return chatConversations[chatId] || [];
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add welcome message for special chat types
  useEffect(() => {
    if (chatId === 'helpline' && messages.length === 0) {
      setMessages([{
        id: '1',
        text: 'Hello! This is KARAGIRX Team Helpline. How can we assist you today?',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
    } else if (chatId === 'aichatbot' && messages.length === 0) {
      setMessages([{
        id: '1',
        text: '👋 Hello! I\'m your AI assistant. I can help answer your questions about construction, materials, and more. What would you like to know?',
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }]);
    }
  }, [chatId, messages.length]);

  // Update messages when chatId changes
  useEffect(() => {
    setMessages(chatConversations[chatId] || []);
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getResponseMessage = useCallback((message: string, currentChatId: string): string => {
    // Default response for regular chats
    return `Thanks for your message about "${message}". I'll get back to you soon.`;
  }, []);

  const getAIResponse = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! How can I assist you with your construction needs today?';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return 'Our prices vary depending on the project scope and materials. Could you please specify what you\'re looking for? (e.g., residential construction, materials, labor costs)';
    } else if (lowerMessage.includes('material') || lowerMessage.includes('cement') || lowerMessage.includes('brick') || lowerMessage.includes('steel')) {
      return 'We can help you source high-quality construction materials. Would you like information about specific materials or suppliers?';
    } else if (lowerMessage.includes('time') || lowerMessage.includes('duration') || lowerMessage.includes('how long')) {
      return 'Project timelines depend on the scope and scale. A typical residential project takes 8-12 months. Would you like a more detailed estimate for your specific project?';
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    } else {
      return 'I understand you\'re asking about: ' + message + '. For the most accurate information, I recommend connecting with one of our construction specialists. Would you like me to connect you with a human expert?';
    }
  }, []);

  const handleSendMessage = useCallback((message: TextMessage | FileMessage) => {
    // Handle text message
    if (message.type === 'text') {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.content,
        sender: 'me' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent' as const,
      };
      setMessages(prev => [...prev, newMessage]);

      // Simulate response after 1 second
      setTimeout(() => {
        let responseText = '';
        
        if (chatId === 'helpline') {
          responseText = 'Thank you for your message. Our support team will get back to you shortly.';
        } else if (chatId === 'aichatbot') {
          responseText = getAIResponse(message.content);
        } else {
          responseText = getResponseMessage(message.content, chatId);
        }
        
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read' as const
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  }, [chatId, getAIResponse, getResponseMessage]);

  const handleSendFile = useCallback((file: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: file.name,
      sender: 'me' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const,
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleCallStart = useCallback((type: 'audio' | 'video') => {
    const callType = type === 'audio' ? 'voice' : 'video';
    setCallType(type);
    setActiveCallType(callType);
    setIsInCall(true);
    
    // Notify parent components about the call state change
    if (onCallStateChange) {
      onCallStateChange(true, callType);
    }
  }, [onCallStateChange]);

  const handleEndCall = useCallback((duration: number = 0) => {
    setIsInCall(false);
    setCallType(null);
    setActiveCallType(null);
    
    // Notify parent components about the call state change
    if (onCallStateChange) {
      onCallStateChange(false, null);
    }
    
    if (onTabChange) {
      onTabChange('Calls');
    }
  }, [onTabChange, onCallStateChange]);

  if (isInCall && callType) {
    return (
      <CallScreen 
        type={callType === 'audio' ? 'voice' : 'video'}
        contact={{
          id: chatContact.id,
          name: chatContact.name,
          avatar: chatContact.avatar
        }}
        onEndCall={handleEndCall}
        onAddToCallHistory={(call) => {
          // Handle adding to call history if needed
          console.log('Call added to history:', call);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0B141A] text-white">
      <ChatHeader 
        chatId={chatId} 
        onBack={onBack} 
        chatContact={chatContact} 
        isInCall={isInCall}
        onCallStateChange={(inCall, callType) => {
          setIsInCall(inCall);
          setActiveCallType(callType);
          if (!inCall && onTabChange) {
            onTabChange('Calls');
          }
        }}
        onTabChange={onTabChange}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <MessageInput 
          onSendMessage={(message: TextMessage | FileMessage) => {
            if (message.type === 'text') {
              handleSendMessage(message);
            } else if (message.type === 'file') {
              // This should be handled by onSendFile
              console.log('File message received in onSendMessage, should be handled by onSendFile');
            }
          }}
          onSendFile={(file) => {
            handleSendFile(file);
          }}
          onStartVoiceCall={() => handleCallStart('audio')}
          onStartVideoCall={() => handleCallStart('video')}
        />
      </div>
    </div>
  );
};
