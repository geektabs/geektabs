import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Plus, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'motion/react';
import Clock from '../Clock/Clock';
import ConfirmModal from '../ConfirmModal';

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  links: Link[];
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'default',
    name: 'Home',
    links: [
      { id: '1', title: 'Reddit', url: 'https://reddit.com' },
      { id: 'h2', title: 'Facebook', url: 'https://facebook.com' },
      { id: 'h3', title: 'Instagram', url: 'https://instagram.com' },
      { id: 'h4', title: 'Threads', url: 'https://threads.net' },
      { id: 'h5', title: 'TikTok', url: 'https://tiktok.com' },
      { id: 'h6', title: 'LinkedIn', url: 'https://linkedin.com' },
      { id: 'h7', title: 'Discord', url: 'https://discord.com' },
      { id: 'h8', title: 'Quora', url: 'https://quora.com' },
      { id: 'h9', title: 'Medium', url: 'https://medium.com' },
      { id: 'h10', title: 'Pinterest', url: 'https://pinterest.com' },
      { id: 'h11', title: 'X (Twitter)', url: 'https://x.com' },
      { id: 'h_substack', title: 'Substack', url: 'https://substack.com' },
      { id: 'h14', title: 'Discovery', url: 'https://wisenavigation.dpdns.org/', description: 'Wise Navigation web portal and navigation services.' },
      { id: 'h15', title: 'PurestWay', url: 'https://purestway.substack.com/', description: 'PurestWay publication on Substack.' }
    ]
  },
  {
    id: 'google-apps',
    name: 'Google Apps',
    links: [
      { id: 'g1', title: 'Account', url: 'https://myaccount.google.com', description: 'Manage your Google Account info, privacy, and security.' },
      { id: 'g2', title: 'Search', url: 'https://www.google.com', description: 'Google web search engine to find information online.' },
      { id: 'g3', title: 'Maps', url: 'https://maps.google.com', description: 'Web mapping platform and consumer service by Google.' },
      { id: 'g4', title: 'YouTube', url: 'https://youtube.com', description: 'Online video sharing and social media platform.' },
      { id: 'g5', title: 'Play', url: 'https://play.google.com', description: 'Digital content and app store.' },
      { id: 'g6', title: 'News', url: 'https://news.google.com', description: "Personalized news aggregator that organizes and highlights what's happening." },
      { id: 'g7', title: 'Gmail', url: 'https://gmail.com', description: 'Email service developed by Google with ample storage.' },
      { id: 'g8', title: 'Contacts', url: 'https://contacts.google.com', description: "Google's contact management tool to keep your address book organized." },
      { id: 'g9', title: 'Drive', url: 'https://drive.google.com', description: 'File storage and synchronization service developed by Google.' },
      { id: 'g10', title: 'Calendar', url: 'https://calendar.google.com', description: 'Time-management and scheduling calendar service.' },
      { id: 'g11', title: 'Translate', url: 'https://translate.google.com', description: 'Free neural machine translation service developed by Google.' },
      { id: 'g12', title: 'Photos', url: 'https://photos.google.com', description: 'Photo sharing and storage service developed by Google.' },
      { id: 'g13', title: 'Docs', url: 'https://docs.google.com', description: 'Online word processor that lets you create and format documents.' },
      { id: 'g30', title: 'Sheets', url: 'https://docs.google.com/spreadsheets', description: 'Web-based spreadsheet application.' },
      { id: 'g31', title: 'Slides', url: 'https://docs.google.com/presentation', description: 'Web-based presentation application.' },
      { id: 'g32', title: 'Classroom', url: 'https://classroom.google.com', description: 'Blended learning platform for schools.' },
      { id: 'g14', title: 'Blogger', url: 'https://blogger.com', description: 'American online content management system for blog publishing.' },
      { id: 'g15', title: 'Duo', url: 'https://duo.google.com', description: 'High-quality video and audio calling app by Google.' },
      { id: 'g16', title: 'Chat', url: 'https://chat.google.com', description: "Google's messaging platform for chats and conversations." },
      { id: 'g17', title: 'Keep', url: 'https://keep.google.com', description: 'Note-taking service developed by Google.' },
      { id: 'g19', title: 'Earth', url: 'https://earth.google.com', description: 'Geographic information program that presents a 3D representation of Earth.' },
      { id: 'g20', title: 'Saved', url: 'https://www.google.com/save', description: "Google's bookmarking tool to save and organize links, images, and places." },
      { id: 'g21', title: 'TV', url: 'https://tv.google', description: 'Content streaming hub and guide.' },
      { id: 'g22', title: 'Podcasts', url: 'https://podcasts.google.com', description: 'Podcast streaming (transitioned to YouTube Music).' },
      { id: 'g23', title: 'Finance', url: 'https://www.google.com/finance', description: 'Financial tracking.' },
      { id: 'g24', title: 'Books', url: 'https://books.google.com', description: 'Book search and previewing tool.' },
      { id: 'g25', title: 'Scholar', url: 'https://scholar.google.com', description: 'Search engine for academic literature.' },
      { id: 'g26', title: 'Pay', url: 'https://pay.google.com', description: 'Digital wallet and payment platform.' },
      { id: 'g28', title: 'Ads', url: 'https://ads.google.com', description: 'Pay-per-click advertising platform.' },
      { id: 'g29', title: 'AdSense', url: 'https://adsense.google.com', description: 'Ad placement program for publishers.' },
      { id: 'g33', title: 'Voice', url: 'https://voice.google.com', description: 'Telephone service that provides call forwarding and voicemail services.' },
      { id: 'g34', title: 'Meet', url: 'https://meet.google.com', description: 'Video-communication service developed by Google.' },
      { id: 'g35', title: 'Analytics', url: 'https://analytics.google.com', description: 'Web analytics service offered by Google.' },
      { id: 'g36', title: 'Tasks', url: 'https://tasks.google.com', description: 'Task management service developed by Google.' },
      { id: 'g37', title: 'YouTube Music', url: 'https://music.youtube.com', description: 'Online music streaming service developed by YouTube.' },
      { id: 'g38', title: 'Shopping', url: 'https://shopping.google.com', description: 'Google Shopping service to search and compare products.' },
      { id: 'g39', title: 'Travel', url: 'https://www.google.com/travel', description: 'Trip planning tool and travel guides.' },
      { id: 'g40', title: 'One', url: 'https://one.google.com', description: 'Expanded cloud storage and member benefits.' },
      { id: 'g42', title: 'Store', url: 'https://store.google.com', description: 'Official store for Google hardware products and accessories.' },
      { id: 'g43', title: 'Business Profile Manager', url: 'https://business.google.com', description: 'Manage how your business info appears on Google Search and Maps.' }
    ]
  },
  {
    id: 'ms-office',
    name: 'Microsoft Office',
    links: [
      { id: 'm1', title: 'Word', url: 'https://www.office.com/launch/word', description: 'Web-based word processor for creating and editing documents.' },
      { id: 'm2', title: 'Excel', url: 'https://www.office.com/launch/excel', description: 'Web-based spreadsheet application for data analysis and charting.' },
      { id: 'm4', title: 'OneNote', url: 'https://www.office.com/launch/onenote', description: 'Digital note-taking and organization tool.' },
      { id: 'm3', title: 'PowerPoint', url: 'https://www.office.com/launch/powerpoint', description: 'Web application to design and present slide shows.' },
      { id: 'm5', title: 'Outlook', url: 'https://outlook.live.com/', description: 'Webmail client for managing emails and calendars.' },
      { id: 'm6', title: 'OneDrive', url: 'https://onedrive.live.com/', description: 'Cloud storage service for saving and sharing files.' },
      { id: 'm7', title: 'Sway', url: 'https://sway.office.com/', description: 'A presentation web application to create and share interactive reports and stories.' },
      { id: 'm8', title: 'Forms', url: 'https://forms.office.com/', description: 'An online survey, quiz, and poll creator.' },
      { id: 'm9', title: 'Loop', url: 'https://loop.microsoft.com/', description: 'A collaborative canvas app where teams can think, plan, and create together.' },
      { id: 'm10', title: 'Lists', url: 'https://lists.live.com/', description: 'A web application to track information, organize work, and manage workflows.' },
      { id: 'm11', title: 'Clipchamp', url: 'https://app.clipchamp.com/', description: 'A web-based video editing tool integrated with the platform.' }
    ]
  },
  {
    id: 'music',
    name: 'Music',
    links: [
      { id: 'mu1', title: 'Spotify', url: 'https://open.spotify.com', description: 'Music and podcast streaming service with millions of songs and podcasts.' },
      { id: 'mu2', title: 'Apple Music', url: 'https://music.apple.com', description: 'Streaming service with over 100 million songs, curated playlists, and spatial audio.' },
      { id: 'mu3', title: 'Amazon Music', url: 'https://music.amazon.com', description: 'Stream millions of songs and top podcasts with Amazon Music.' },
      { id: 'mu4', title: 'Tidal', url: 'https://listen.tidal.com', description: 'High-fidelity music and video streaming service with HiRes FLAC sound quality.' },
      { id: 'mu5', title: 'Deezer', url: 'https://www.deezer.com', description: 'Music streaming platform offering personalized recommendations and Flow playlist.' },
      { id: 'mu6', title: 'YouTube Music', url: 'https://music.youtube.com', description: 'Music streaming service developed by YouTube featuring official albums and live performances.' },
      { id: 'mu7', title: 'Line Music', url: 'https://music.line.me', description: 'On-demand music streaming service by LINE with trending tracks and MV streaming.' },
      { id: 'mu8', title: 'Pandora', url: 'https://www.pandora.com', description: 'Music and podcast discovery platform powered by the Music Genome Project.' },
      { id: 'mu9', title: 'YouTube', url: 'https://www.youtube.com', description: 'Global video sharing platform for music videos, covers, live concerts, and creators.' },
      { id: 'mu10', title: 'SoundCloud', url: 'https://soundcloud.com', description: 'Artist-first audio platform for discovering, streaming, and sharing music and podcasts.' },
      { id: 'mu11', title: 'Qobuz', url: 'https://www.qobuz.com', description: 'High-resolution music streaming and lossless downloading service for audiophiles.' },
      { id: 'mu12', title: 'Audible', url: 'https://www.audible.com', description: 'Audiobook and podcast platform by Amazon offering premier spoken-word entertainment.' },
      { id: 'mu13', title: 'Dailymotion', url: 'https://www.dailymotion.com', description: 'Video streaming and discovery platform for music videos, news, and entertainment.' },
      { id: 'mu14', title: 'Veoh', url: 'https://www.veoh.com', description: 'Internet television and video service for watching movies, shows, and user videos.' },
      { id: 'mu15', title: 'Vimeo', url: 'https://vimeo.com', description: 'High-quality video hosting, creative sharing, and live streaming platform.' },
      { id: 'mu16', title: 'Beatport', url: 'https://www.beatport.com', description: 'The world\'s leading electronic music store and streaming service for DJs and producers.' },
      { id: 'mu17', title: 'Soundtify', url: 'https://soundtify.dpdns.org/', description: 'Music streaming and audio sharing platform.' }
    ]
  },
  {
    id: 'my-folders',
    name: 'AI Apps',
    links: [
      { id: 'ai1', title: 'ChatGPT', url: 'https://chatgpt.com', description: 'AI chatbot developed by OpenAI.' },
      { id: 'ai2', title: 'Gemini', url: 'https://gemini.google.com', description: 'AI conversational assistant developed by Google.' },
      { id: 'ai3', title: 'Claude', url: 'https://claude.ai', description: 'Next-generation AI assistant developed by Anthropic.' },
      { id: 'ai4', title: 'Grok', url: 'https://grok.com', description: 'AI assistant developed by xAI.' },
      { id: 'ai5', title: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', description: 'AI-powered chat assistant from Microsoft.' },
      { id: 'ai6', title: 'Meta AI', url: 'https://meta.ai', description: 'AI assistant built on Meta Llama.' },
      { id: 'ai7', title: 'Perplexity AI', url: 'https://perplexity.ai', description: 'AI-powered search engine and chatbot.' },
      { id: 'ai8', title: 'Zhipu AI', url: 'https://chat.z.ai/', description: 'Generative AI assistant by Zhipu AI.' },
      { id: 'ai9', title: 'DeepSeek', url: 'https://chat.deepseek.com', description: 'Advanced AI language model and assistant by DeepSeek.' },
      { id: 'ai10', title: 'Qwen AI', url: 'https://chat.qwenlm.ai', description: 'AI model series developed by Alibaba Cloud.' },
      { id: 'ai11', title: 'Midjourney', url: 'https://midjourney.com', description: 'Generative artificial intelligence program for image generation.' },
      { id: 'ai12', title: 'Leonardo AI', url: 'https://leonardo.ai', description: 'AI-driven creative suite for image generation.' },
      { id: 'ai13', title: 'Suno', url: 'https://suno.com', description: 'Generative AI music and speech creation platform.' },
      { id: 'ai14', title: 'Murf AI', url: 'https://murf.ai', description: 'Versatile AI voice generator and text-to-speech platform.' },
      { id: 'ai15', title: 'HeyGen', url: 'https://heygen.com', description: 'AI video generation platform for creating avatars.' },
      { id: 'ai16', title: 'Pictory', url: 'https://pictory.ai', description: 'AI video generator for content creators.' },
      { id: 'ai17', title: 'DeepL Write', url: 'https://www.deepl.com/write', description: 'AI writing assistant for grammar and style.' },
      { id: 'ai18', title: 'Jasper', url: 'https://jasper.ai', description: 'AI copilot for enterprise marketing and content writing.' },
      { id: 'ai19', title: 'Canva', url: 'https://canva.com', description: 'Graphic design platform with integrated AI tools.' },
      { id: 'ai20', title: 'Fotor', url: 'https://www.fotor.com', description: 'Online photo editor and AI-powered graphic designer.' }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping',
    links: [
      { id: 's1', title: 'Amazon', url: 'https://www.amazon.com', description: 'Online shopping for electronics, apparel, computers, books, and more.' },
      { id: 's2', title: 'Bjs', url: 'https://www.bjs.com', description: 'Warehouse club offering groceries, electronics, and home essentials.' },
      { id: 's3', title: 'Walmart', url: 'https://www.walmart.com', description: 'Department store for everyday low prices on groceries and goods.' },
      { id: 's4', title: 'Target', url: 'https://www.target.com', description: 'Retail store for trendy clothing, home essentials, and electronics.' },
      { id: 's5', title: 'Costco', url: 'https://www.costco.com', description: 'Wholesale warehouse offering bulk goods, electronics, and groceries.' },
      { id: 's6', title: "Macy's", url: 'https://www.macys.com', description: 'Department store featuring fashion, cosmetics, and home decor.' },
      { id: 's7', title: 'Walgreens', url: 'https://www.walgreens.com', description: 'Pharmacy, health and wellness products, and photo services.' },
      { id: 's8', title: 'CVS', url: 'https://www.cvs.com', description: 'Pharmacy store for prescriptions, health products, and convenience items.' },
      { id: 's9', title: "Sam's Club", url: 'https://www.samsclub.com', description: 'Membership warehouse club with bulk savings and exclusive deals.' },
      { id: 's10', title: "Kohl's", url: 'https://www.kohls.com', description: 'Department store for clothing, shoes, bedding, and home goods.' },
      { id: 's11', title: 'JCPenney', url: 'https://www.jcpenney.com', description: 'Apparel, footwear, jewelry, beauty, and home furnishings.' },
      { id: 's12', title: 'eBay', url: 'https://www.ebay.com', description: 'Online marketplace for buying and selling new and vintage items.' },
      { id: 's13', title: 'Nordstrom', url: 'https://www.nordstrom.com', description: 'Luxury department store for designer fashion, shoes, and beauty.' },
      { id: 's14', title: 'Saks Fifth Avenue', url: 'https://www.saksfifthavenue.com', description: 'Premier luxury shopping destination for designer apparel and accessories.' },
      { id: 's15', title: 'Neiman Marcus', url: 'https://www.neimanmarcus.com', description: 'Luxury specialty retailer offering high-end fashion and beauty.' },
      { id: 's16', title: 'Nordstrom Rack', url: 'https://www.nordstromrack.com', description: 'Discount destination for top brands, designer apparel, and shoes.' },
      { id: 's17', title: 'Gap', url: 'https://www.gap.com', description: 'Casual clothing and classic American style essentials.' },
      { id: 's18', title: 'Old Navy', url: 'https://oldnavy.gap.com', description: 'Affordable fashion, activewear, and everyday essentials.' },
      { id: 's19', title: 'Banana Republic', url: 'https://bananarepublic.gap.com', description: 'Contemporary apparel and sophisticated wardrobe staples.' },
      { id: 's20', title: 'J.Crew', url: 'https://www.jcrew.com', description: 'Classic and modern styles, cashmere, denim, and workwear.' },
      { id: 's21', title: 'Abercrombie & Fitch', url: 'https://www.abercrombie.com', description: 'Casual luxury apparel, denim, and trendy lifestyle fashion.' },
      { id: 's22', title: 'Uniqlo', url: 'https://www.uniqlo.com', description: 'Innovative LifeWear designed for simple, high-quality daily wear.' },
      { id: 's23', title: 'Home Depot', url: 'https://www.homedepot.com', description: 'Home improvement supplies, tools, appliances, and building materials.' },
      { id: 's24', title: "Lowe's", url: 'https://www.lowes.com', description: 'Home improvement, appliances, hardware, and DIY project supplies.' },
      { id: 's25', title: 'Wayfair', url: 'https://www.wayfair.com', description: 'Online furniture store and home decor for every room and budget.' },
      { id: 's26', title: 'IKEA', url: 'https://www.ikea.com', description: 'Affordable Scandinavian furniture, smart home, and decor items.' },
      { id: 's27', title: 'Crate & Barrel', url: 'https://www.crateandbarrel.com', description: 'Modern furniture, kitchenware, and contemporary home accessories.' },
      { id: 's28', title: 'Best Buy', url: 'https://www.bestbuy.com', description: 'Consumer electronics, computers, appliances, and tech support.' },
      { id: 's29', title: 'Etsy', url: 'https://www.etsy.com', description: 'Global marketplace for unique, handcrafted, and vintage items.' },
      { id: 's30', title: 'Temu', url: 'https://www.temu.com', description: 'Online marketplace with competitive prices across endless categories.' },
      { id: 's31', title: 'AliExpress', url: 'https://www.aliexpress.com', description: 'Global online retail marketplace with direct-from-manufacturer deals.' },
      { id: 's32', title: 'SHEIN', url: 'https://www.shein.com', description: 'Global fashion and lifestyle e-retailer offering trendy styles.' },
      { id: 's33', title: 'Poshmark', url: 'https://poshmark.com', description: 'Social marketplace for buying and selling fashion, luxury, and home.' }
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    links: [
      { id: 'tr1', title: 'Expedia', url: 'https://www.expedia.com', description: 'Book flights, hotels, vacation packages, car rentals, and cruises.' },
      { id: 'tr2', title: 'Trip.com', url: 'https://www.trip.com', description: 'Global travel service provider for cheap flights, hotels, and train tickets.' },
      { id: 'tr3', title: 'Booking.com', url: 'https://www.booking.com', description: 'Explore hotel deals, private villas, flights, and car rentals worldwide.' },
      { id: 'tr4', title: 'Agoda', url: 'https://www.agoda.com', description: 'Discount hotel bookings, flight tickets, and vacation rentals worldwide.' },
      { id: 'tr5', title: 'Priceline', url: 'https://www.priceline.com', description: 'Deep discounts on hotels, flights, and rental cars with Express Deals.' },
      { id: 'tr6', title: 'Hotels.com', url: 'https://www.hotels.com', description: 'Compare hotel rates, book accommodations, and earn OneKeyCash.' },
      { id: 'tr7', title: 'KAYAK', url: 'https://www.kayak.com', description: 'Search and compare prices across hundreds of travel sites at once.' },
      { id: 'tr8', title: 'Travelocity', url: 'https://www.travelocity.com', description: 'Wander wisely with deals on flights, hotels, car rentals, and packages.' },
      { id: 'tr9', title: 'Orbitz', url: 'https://www.orbitz.com', description: 'Plan your trip with rewards on flights, hotel bookings, and vacation rentals.' },
      { id: 'tr10', title: 'Hotwire', url: 'https://www.hotwire.com', description: 'Last-minute travel deals on top hotels, flights, and car rentals.' },
      { id: 'tr11', title: 'Traveloka', url: 'https://www.traveloka.com', description: "Southeast Asia's leading lifestyle superapp for travel and attractions." },
      { id: 'tr12', title: 'MakeMyTrip', url: 'https://www.makemytrip.com', description: "India's leading travel portal for flights, hotels, buses, and holidays." },
      { id: 'tr13', title: 'EaseMyTrip', url: 'https://www.easemytrip.com', description: 'Book domestic and international flights with zero convenience fees.' },
      { id: 'tr14', title: 'Cleartrip', url: 'https://www.cleartrip.com', description: 'Simple, fast, and seamless booking for flights, hotels, and holidays.' },
      { id: 'tr15', title: 'Airbnb', url: 'https://www.airbnb.com', description: 'Find vacation home rentals, cabins, beach houses, and unique stays.' },
      { id: 'tr16', title: 'Vrbo', url: 'https://www.vrbo.com', description: 'Discover whole homes, beach condos, cabins, and lakefront retreats.' },
      { id: 'tr17', title: 'Hostelworld', url: 'https://www.hostelworld.com', description: 'Budget hostel accommodations and social travel community worldwide.' },
      { id: 'tr18', title: 'Trivago', url: 'https://www.trivago.com', description: 'Compare hotel prices from top booking sites to find the best deal.' },
      { id: 'tr20', title: 'Google Flights', url: 'https://www.google.com/travel/flights', description: 'Find cheap flight deals, price tracking, and explore destinations.' },
      { id: 'tr21', title: 'Skyscanner', url: 'https://www.skyscanner.com', description: 'Compare cheap flights, hotel rooms, and car hire options globally.' },
      { id: 'tr22', title: 'Momondo', url: 'https://www.momondo.com', description: 'Free global travel search comparing billions of flights, hotels, and cars.' },
      { id: 'tr23', title: 'Kiwi.com', url: 'https://www.kiwi.com', description: 'Unique virtual interlining technology to find hidden cheap flight routes.' },
      { id: 'tr24', title: 'CheapOair', url: 'https://www.cheapoair.com', description: 'Discount airline tickets, cheap flights, vacation packages, and hotels.' },
      { id: 'tr25', title: 'Hopper', url: 'https://hopper.com', description: 'Predict flight and hotel prices with smart price-freeze algorithms.' },
      { id: 'tr26', title: 'Rentalcars.com', url: 'https://www.rentalcars.com', description: 'Compare rental car deals across thousands of locations worldwide.' },
      { id: 'tr27', title: 'Turo', url: 'https://turo.com', description: "The world's largest peer-to-peer car sharing marketplace." },
      { id: 'tr28', title: 'Discover Cars', url: 'https://www.discovercars.com', description: 'Award-winning car rental comparison and reservation service.' },
      { id: 'tr29', title: 'GetYourGuide', url: 'https://www.getyourguide.com', description: 'Book unforgettable travel experiences, tours, and attraction tickets.' },
      { id: 'tr30', title: 'Viator', url: 'https://www.viator.com', description: 'Explore thousands of tours, day trips, and activities worldwide.' },
      { id: 'tr31', title: 'Tiqets', url: 'https://www.tiqets.com', description: 'Instant mobile tickets for top museums, cultural sights, and attractions.' }
    ]
  },
  {
    id: 'tech',
    name: 'Technology',
    links: [
      { id: 'tech1', title: 'Apple', url: 'https://www.apple.com', description: 'Innovative technology products including iPhone, iPad, Mac, and Apple Watch.' },
      { id: 'tech2', title: 'Microsoft', url: 'https://www.microsoft.com', description: 'Devices, software, Windows, cloud solutions, and productivity tools.' },
      { id: 'tech3', title: 'Google', url: 'https://www.google.com', description: 'Search engine, Android, Pixel hardware, cloud computing, and AI services.' },
      { id: 'tech4', title: 'Samsung', url: 'https://www.samsung.com', description: 'Galaxy smartphones, tablets, home appliances, displays, and electronics.' },
      { id: 'tech5', title: 'Lenovo', url: 'https://www.lenovo.com', description: 'ThinkPad laptops, PCs, tablets, data center solutions, and accessories.' },
      { id: 'tech6', title: 'Dell Technologies', url: 'https://www.dell.com', description: 'Laptops, workstations, desktop computers, servers, and enterprise solutions.' },
      { id: 'tech7', title: 'HP', url: 'https://www.hp.com', description: 'Laptops, desktops, printers, monitors, and business computing solutions.' },
      { id: 'tech8', title: 'Intel', url: 'https://www.intel.com', description: 'Processors, microchips, data center computing, and semiconductor innovations.' },
      { id: 'tech9', title: 'NVIDIA', url: 'https://www.nvidia.com', description: 'Pioneering GPU computing, artificial intelligence, gaming, and robotics.' },
      { id: 'tech10', title: 'AMD', url: 'https://www.amd.com', description: 'Ryzen and EPYC processors, Radeon graphics, and computing technology.' },
      { id: 'tech11', title: 'Sony', url: 'https://www.sony.com', description: 'Audio, cameras, PlayStation gaming, TVs, and entertainment electronics.' },
      { id: 'tech12', title: 'LG', url: 'https://www.lg.com', description: 'OLED TVs, home appliances, monitors, and audio electronics.' },
      { id: 'tech13', title: 'ASUS', url: 'https://www.asus.com', description: 'ROG gaming hardware, ZenBook laptops, motherboards, and PC components.' },
      { id: 'tech14', title: 'Acer', url: 'https://www.acer.com', description: 'Laptops, Predator gaming computers, monitors, and projectors.' },
      { id: 'tech15', title: 'Xiaomi', url: 'https://www.mi.com', description: 'Smartphones, smart home IoT ecosystem products, and consumer electronics.' },
      { id: 'tech16', title: 'Huawei', url: 'https://www.huawei.com', description: 'Smart devices, smartphones, telecom infrastructure, and cloud solutions.' },
      { id: 'tech17', title: 'OnePlus', url: 'https://www.oneplus.com', description: 'High-performance flagship smartphones, earbuds, and wearables.' },
      { id: 'tech18', title: 'Motorola', url: 'https://www.motorola.com', description: 'Razr flip phones, Edge series smartphones, and mobile technology.' },
      { id: 'tech19', title: 'TCL', url: 'https://www.tcl.com', description: 'Smart televisions, mobile devices, audio gear, and home appliances.' },
      { id: 'tech20', title: 'Panasonic', url: 'https://www.panasonic.com', description: 'Consumer electronics, Lumix cameras, home appliances, and automotive tech.' },
      { id: 'tech21', title: 'Adobe', url: 'https://www.adobe.com', description: 'Creative Cloud applications including Photoshop, Illustrator, Premiere, and Acrobat.' },
      { id: 'tech22', title: 'Oracle', url: 'https://www.oracle.com', description: 'Cloud infrastructure, enterprise database software, and ERP business systems.' },
      { id: 'tech23', title: 'IBM', url: 'https://www.ibm.com', description: 'Enterprise hybrid cloud, quantum computing, artificial intelligence, and IT services.' },
      { id: 'tech24', title: 'Salesforce', url: 'https://www.salesforce.com', description: 'Cloud-based customer relationship management (CRM) and enterprise software.' },
      { id: 'tech25', title: 'SAP', url: 'https://www.sap.com', description: 'Market leader in enterprise application software, ERP, and business networks.' },
      { id: 'tech26', title: 'Cisco', url: 'https://www.cisco.com', description: 'Networking hardware, cybersecurity, cloud software, and telecommunications.' },
      { id: 'tech27', title: 'VMware', url: 'https://www.vmware.com', description: 'Cloud infrastructure, virtualization technology, and digital workspace solutions.' }
    ]
  },
  {
    id: 'tools',
    name: 'Tools',
    links: [
      { id: 't1', title: 'Crikk TTS', url: 'https://crikk.com/text-to-speech/', description: 'Free Text to Speech tool with realistic voices.' },
      { id: 't2', title: 'TinyWow', url: 'https://tinywow.com/', description: 'Free online PDF, video, image & other tools.' },
      { id: 't3', title: 'Clideo', url: 'https://clideo.com/', description: 'All-in-one online video tools to create, edit, compress, and resize.' },
      { id: 't4', title: 'RecordCast', url: 'https://www.recordcast.com/', description: 'Free online screen recorder and video editor.' },
      { id: 't5', title: 'Apowersoft Audio Recorder', url: 'https://www.apowersoft.com/free-audio-recorder-online', description: 'Free online audio recorder for microphone and computer system audio.' }
    ]
  }
];

const LINKS_T: Record<string, Record<string, string>> = {
  English: {
    addBookmark: 'Add Bookmark',
    saveTo: 'Save to',
    titleLabel: 'Title',
    urlLabel: 'URL',
    placeholderTitle: 'e.g. Work Dashboard',
    placeholderUrl: 'e.g. app.work.com',
    cancel: 'Cancel',
    newCategory: 'New Category',
    createCategoryDesc: 'Create a new category',
    categoryName: 'Category Name',
    placeholderCategory: 'e.g. Shopping',
    create: 'Create',
    deleteCategoryTitle: 'Delete Category',
    deleteCategoryMsg: 'Are you sure you want to delete this category and all its links? This action cannot be undone.',
    deleteBookmarkTitle: 'Delete Bookmark',
    deleteBookmarkMsg: 'Are you sure you want to delete this bookmark?',
  },
  Korean: {
    addBookmark: '북마크 추가',
    saveTo: '다음 폴더에 저장: ',
    titleLabel: '이름',
    urlLabel: 'URL 주소',
    placeholderTitle: '예: 회사 대시보드',
    placeholderUrl: '예: app.work.com',
    cancel: '취소',
    newCategory: '새 카테고리',
    createCategoryDesc: '새로운 카테고리를 생성합니다',
    categoryName: '카테고리 이름',
    placeholderCategory: '예: 쇼핑',
    create: '생성',
    deleteCategoryTitle: '카테고리 삭제',
    deleteCategoryMsg: '이 카테고리와 모든 링크를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    deleteBookmarkTitle: '북마크 삭제',
    deleteBookmarkMsg: '이 북마크를 삭제하시겠습니까?',
  },
  Spanish: {
    addBookmark: 'Añadir marcador',
    saveTo: 'Guardar en',
    titleLabel: 'Título',
    urlLabel: 'URL',
    placeholderTitle: 'p. ej. Panel de trabajo',
    placeholderUrl: 'p. ej. app.trabajo.com',
    cancel: 'Cancelar',
    newCategory: 'Nueva categoría',
    createCategoryDesc: 'Crear una nueva categoría',
    categoryName: 'Nombre de categoría',
    placeholderCategory: 'p. ej. Compras',
    create: 'Crear',
    deleteCategoryTitle: 'Eliminar categoría',
    deleteCategoryMsg: '¿Estás seguro de que deseas eliminar esta categoría y todos sus enlaces? Esta acción no se puede deshacer.',
    deleteBookmarkTitle: 'Eliminar marcador',
    deleteBookmarkMsg: '¿Estás seguro de que deseas eliminar este marcador?',
  },
  French: {
    addBookmark: 'Ajouter un favori',
    saveTo: 'Enregistrer dans',
    titleLabel: 'Titre',
    urlLabel: 'URL',
    placeholderTitle: 'ex. Tableau de bord',
    placeholderUrl: 'ex. app.travail.com',
    cancel: 'Annuler',
    newCategory: 'Nouvelle catégorie',
    createCategoryDesc: 'Créer une nouvelle catégorie',
    categoryName: 'Nom de la catégorie',
    placeholderCategory: 'ex. Achats',
    create: 'Créer',
    deleteCategoryTitle: 'Supprimer la catégorie',
    deleteCategoryMsg: 'Êtes-vous sûr de vouloir supprimer cette catégorie et tous ses liens ? Cette action est irréversible.',
    deleteBookmarkTitle: 'Supprimer le favori',
    deleteBookmarkMsg: 'Êtes-vous sûr de vouloir supprimer ce favori ?',
  },
  German: {
    addBookmark: 'Lesezeichen hinzufügen',
    saveTo: 'Speichern unter',
    titleLabel: 'Titel',
    urlLabel: 'URL',
    placeholderTitle: 'z. B. Arbeits-Dashboard',
    placeholderUrl: 'z. B. app.arbeit.com',
    cancel: 'Abbrechen',
    newCategory: 'Neue Kategorie',
    createCategoryDesc: 'Eine neue Kategorie erstellen',
    categoryName: 'Kategorie-Name',
    placeholderCategory: 'z. B. Einkaufen',
    create: 'Erstellen',
    deleteCategoryTitle: 'Kategorie löschen',
    deleteCategoryMsg: 'Sind Sie sicher, dass Sie diese Kategorie und alle ihre Links löschen möchten? Dies kann nicht rückgängig gemacht werden.',
    deleteBookmarkTitle: 'Lesezeichen löschen',
    deleteBookmarkMsg: 'Sind Sie sicher, dass Sie dieses Lesezeichen löschen möchten?',
  },
  Chinese: {
    addBookmark: '添加书签',
    saveTo: '保存到',
    titleLabel: '名称标题',
    urlLabel: '网页链接',
    placeholderTitle: '例如：工作仪表盘',
    placeholderUrl: '例如：app.work.com',
    cancel: '取消',
    newCategory: '新建分类',
    createCategoryDesc: '创建一个新的书签分类',
    categoryName: '分类名称',
    placeholderCategory: '例如：日常购物',
    create: '创建',
    deleteCategoryTitle: '删除分类',
    deleteCategoryMsg: '您确定要删除此分类及其中的所有书签吗？该操作无法撤销。',
    deleteBookmarkTitle: '删除书签',
    deleteBookmarkMsg: '您确定要删除此书签吗？',
  },
  Japanese: {
    addBookmark: 'ブックマークを追加',
    saveTo: '保存先',
    titleLabel: 'タイトル',
    urlLabel: 'URL',
    placeholderTitle: '例：仕事用ダッシュボード',
    placeholderUrl: '例：app.work.com',
    cancel: 'キャンセル',
    newCategory: '新規カテゴリー',
    createCategoryDesc: '新しいカテゴリーを作成します',
    categoryName: 'カテゴリー名',
    placeholderCategory: '例：ショッピング',
    create: '作成',
    deleteCategoryTitle: 'カテゴリーの削除',
    deleteCategoryMsg: 'このカテゴリーと含まれるすべてのリンクを削除してもよろしいですか？この操作は元に戻せません。',
    deleteBookmarkTitle: 'ブックマークの削除',
    deleteBookmarkMsg: 'このブックマークを削除してもよろしいですか？',
  },
  Italian: {
    addBookmark: 'Aggiungi preferito',
    saveTo: 'Salva in',
    titleLabel: 'Titolo',
    urlLabel: 'URL',
    placeholderTitle: 'es. Cruscotto di lavoro',
    placeholderUrl: 'es. app.lavoro.com',
    cancel: 'Annulla',
    newCategory: 'Nuova categoria',
    createCategoryDesc: 'Crea una nuova categoria',
    categoryName: 'Nome categoria',
    placeholderCategory: 'es. Shopping',
    create: 'Crea',
    deleteCategoryTitle: 'Elimina categoria',
    deleteCategoryMsg: 'Sei sicuro di voler eliminare questa categoria e tutti i suoi link? Questa azione non può essere annullata.',
    deleteBookmarkTitle: 'Elimina preferito',
    deleteBookmarkMsg: 'Sei sicuro di voler eliminare questo preferito?',
  },
  Russian: {
    addBookmark: 'Добавить закладку',
    saveTo: 'Сохранить в',
    titleLabel: 'Название',
    urlLabel: 'Ссылка',
    placeholderTitle: 'например, Рабочая панель',
    placeholderUrl: 'например, app.work.com',
    cancel: 'Отмена',
    newCategory: 'Новая категория',
    createCategoryDesc: 'Создать новую категорию',
    categoryName: 'Название категории',
    placeholderCategory: 'например, Покупки',
    create: 'Создать',
    deleteCategoryTitle: 'Удалить категорию',
    deleteCategoryMsg: 'Вы уверены, что хотите удалить эту категорию и все ее ссылки? Это действие нельзя отменить.',
    deleteBookmarkTitle: 'Удалить закладку',
    deleteBookmarkMsg: 'Вы уверены, что хотите удалить эту закладку?',
  },
  Luxembourgish: {
    addBookmark: 'Bookmark derbäisetzen',
    saveTo: 'Späicheren an',
    titleLabel: 'Titel',
    urlLabel: 'URL',
    placeholderTitle: 'z. B. Aarbechts-Dashboard',
    placeholderUrl: 'z. B. app.work.com',
    cancel: 'Ofbriechen',
    newCategory: 'Nei Kategorie',
    createCategoryDesc: 'Eng nei Kategorie erstellen',
    categoryName: 'Kategorienumm',
    placeholderCategory: 'z. B. Shopping',
    create: 'Erstellen',
    deleteCategoryTitle: 'Kategorie läschen',
    deleteCategoryMsg: 'Sidd Dir sécher, datt Dir dës Kategorie an all hir Linke läsche wëllt? Dës Aktioun kann net réckgängeg gemaach ginn.',
    deleteBookmarkTitle: 'Bookmark läschen',
    deleteBookmarkMsg: 'Sidd Dir sécher, datt Dir dëse Bookmark läsche wëllt?',
  }
};

const getFavicon = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent('https://' + domain)}&size=256`;
  } catch (e) {
    return null;
  }
};

const renderBookmarkBrandIcon = (link: Link) => {
  const title = (link.title || '').toLowerCase().trim();
  const url = (link.url || '').toLowerCase();

  // Microsoft OneDrive (Official Cloud Icon)
  if (title === 'onedrive' || title === 'one drive' || url.includes('onedrive.live.com') || url.includes('onedrive')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        {/* Back Cloud */}
        <path
          d="M19.35 10.04C18.67 6.59 15.64 4 12 4 8.7 4 5.9 6.2 5.2 9.2 2.3 9.6 0 12.1 0 15.2 0 18.4 2.6 21 5.8 21H19c2.8 0 5-2.2 5-5 0-2.6-2-4.8-4.65-4.96z"
          fill="#0078D4"
        />
        {/* Front Highlight Cloud */}
        <path
          d="M14.2 9.5c-2.4 0-4.4 1.6-5 3.9a4.2 4.2 0 0 0-3.7 4.1c0 .3.03.6.09.8A3.4 3.4 0 0 0 3 21.2 3 3 0 0 0 6 24.2h11.5a3.5 3.5 0 0 0 3.5-3.5c0-1.8-1.3-3.3-3.1-3.5A4.5 4.5 0 0 0 14.2 9.5z"
          fill="#28A8EA"
          opacity="0.95"
        />
        {/* Depth Arc */}
        <path
          d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-.39 0-.77.04-1.14.11 1.75 1.5 2.87 3.73 2.87 6.22 0 .34-.03.68-.08 1.01.62-.22 1.28-.34 1.98-.34 2.76 0 5.09 1.84 5.72 4.34.62-.87 1-1.94 1-3.1 0-2.64-2.05-4.78-4.65-4.96z"
          fill="#0364B8"
          opacity="0.75"
        />
      </svg>
    );
  }

  // Spotify
  if (title === 'spotify' || url.includes('spotify.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <circle cx="12" cy="12" r="11" fill="#1DB954" />
        <path d="M17.2 16.1a.7.7 0 0 1-1 .2c-2.7-1.7-6.2-2.1-10.2-1.1a.7.7 0 1 1-.4-1.4c4.4-1 8.2-.6 11.3 1.3.3.2.4.7.3 1zm1.4-3.1a.9.9 0 0 1-1.2.3c-3.1-1.9-7.9-2.5-11.6-1.3a.9.9 0 1 1-.6-1.7c4.3-1.3 9.5-.7 13.1 1.5.4.3.5.8.3 1.2zm.1-3.2c-3.7-2.2-9.9-2.4-13.4-1.3a1.1 1.1 0 1 1-.7-2.1c4.2-1.3 11-1 15.2 1.5a1.1 1.1 0 0 1-1.1 1.9z" fill="#000000" />
      </svg>
    );
  }

  // Apple Music
  if (title === 'apple music' || url.includes('music.apple.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <defs>
          <linearGradient id="amGradIcon" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FA2456" />
            <stop offset="100%" stopColor="#FD3B30" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="url(#amGradIcon)" />
        <path d="M16.8 6.5v8.5a2.5 2.5 0 1 1-2.2-2.5V8.8l-5.6 1.2v6a2.5 2.5 0 1 1-2.2-2.5V8.2c0-.7.5-1.2 1.2-1.4l7.2-1.5c.9-.2 1.6.4 1.6 1.2z" fill="#ffffff" />
      </svg>
    );
  }

  // Amazon Music
  if (title === 'amazon music' || url.includes('music.amazon.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <text x="12" y="11.5" textAnchor="middle" fill="#FF9900" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="7.2" letterSpacing="-0.3">music</text>
        <path d="M5.5 15.2c4.2 2.6 9.5 2.5 13-0.2.2-.2.4 0 .3.2-3.7 3.2-9.5 3.3-13.6.5-.2-.1-.1-.4.3-.5z" fill="#FF9900" />
        <path d="M19 14.2c.4.6.9 1.4 1.2 1.9-.3.2-1.1.2-1.9.1.2-.5.5-1.3.7-2z" fill="#FF9900" />
      </svg>
    );
  }

  // Tidal
  if (title === 'tidal' || url.includes('tidal.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <g fill="#FFC800" transform="translate(12, 12) scale(0.68) translate(-12, -12)">
          <polygon points="4,7 7,4 10,7 7,10" />
          <polygon points="9,7 12,4 15,7 12,10" />
          <polygon points="14,7 17,4 20,7 17,10" />
          <polygon points="9,12 12,9 15,12 12,15" />
        </g>
      </svg>
    );
  }

  // Deezer
  if (title === 'deezer' || url.includes('deezer.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <g fill="#9333EA">
          <rect x="2" y="15" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="15" width="3" height="3" rx="0.5" />
          <rect x="6.5" y="11" width="3" height="3" rx="0.5" />
          <rect x="11" y="15" width="3" height="3" rx="0.5" />
          <rect x="11" y="11" width="3" height="3" rx="0.5" />
          <rect x="11" y="7" width="3" height="3" rx="0.5" />
          <rect x="15.5" y="15" width="3" height="3" rx="0.5" />
          <rect x="15.5" y="11" width="3" height="3" rx="0.5" />
          <rect x="15.5" y="7" width="3" height="3" rx="0.5" />
          <rect x="15.5" y="3" width="3" height="3" rx="0.5" />
          <rect x="20" y="15" width="3" height="3" rx="0.5" />
          <rect x="20" y="11" width="3" height="3" rx="0.5" />
        </g>
      </svg>
    );
  }

  // YouTube Music
  if (title === 'youtube music' || url.includes('music.youtube.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <circle cx="12" cy="12" r="11" fill="#FF0000" />
        <circle cx="12" cy="12" r="6.8" fill="none" stroke="#ffffff" strokeWidth="1.8" />
        <polygon points="10.2,8.8 15.2,12 10.2,15.2" fill="#ffffff" />
      </svg>
    );
  }

  // Line Music
  if (title === 'line music' || url.includes('music.line.me')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M19.5 5.5v10a3 3 0 1 1-2.5-2.9V8.2l-7.5 1.6v7.7a3 3 0 1 1-2.5-2.9V7.2a1.2 1.2 0 0 1 1-1.2l9-1.9c1-.2 2 .5 2 1.6z" fill="none" stroke="#00C73C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Pandora
  if (title === 'pandora' || url.includes('pandora.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M4 3h10c5.2 0 8 3 8 7 0 4.2-3 7-8.2 7h-4v4.5a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8V3.8c0-.4.4-.8.8-.8h-.8z" fill="#3B82F6" />
      </svg>
    );
  }

  // YouTube
  if (title === 'youtube' || (url.includes('youtube.com') && !url.includes('music.youtube.com'))) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <rect x="2" y="4.5" width="20" height="15" rx="4.5" fill="#FF0000" />
        <polygon points="10,8.5 16,12 10,15.5" fill="#ffffff" />
      </svg>
    );
  }

  // SoundCloud
  if (title === 'soundcloud' || url.includes('soundcloud.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M1.5 14.5a.6.6 0 0 1 1.2 0v1.8a.6.6 0 0 1-1.2 0v-1.8zm2.4-2.8a.6.6 0 0 1 1.2 0v5.8a.6.6 0 0 1-1.2 0v-5.8zm2.4-1.8a.6.6 0 0 1 1.2 0v8a.6.6 0 0 1-1.2 0v-8zm2.4-1a.6.6 0 0 1 1.2 0v9.5a.6.6 0 0 1-1.2 0v-9.5zm2.4 1.2a.6.6 0 0 1 1.2 0v8.8a.6.6 0 0 1-1.2 0v-8.8zm2.6-.8c.4-.7 1.1-1.3 2-1.5 2-.4 3.8.9 4.1 2.9 1.8.2 3.2 1.8 3.2 3.6 0 2-1.6 3.7-3.7 3.7H13.7v-8.7z" fill="#FF5500" />
      </svg>
    );
  }

  // Qobuz
  if (title === 'qobuz' || url.includes('qobuz.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <circle cx="11.5" cy="11.5" r="9" fill="none" stroke="#0099D8" strokeWidth="2.5" />
        <circle cx="11.5" cy="11.5" r="5" fill="#0099D8" />
        <circle cx="11.5" cy="11.5" r="1.5" fill="#ffffff" />
        <path d="M16 16l4.5 4.5" stroke="#0099D8" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  // Audible
  if (title === 'audible' || url.includes('audible.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M2.5 16.5c4-2.8 15-2.8 19 0" fill="none" stroke="#F8991D" strokeWidth="2" strokeLinecap="round" />
        <path d="M5.5 13.5c3.2-2.2 9.8-2.2 13 0" fill="none" stroke="#F8991D" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8.5 10.5c2.2-1.5 4.8-1.5 7 0" fill="none" stroke="#F8991D" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Dailymotion
  if (title === 'dailymotion' || url.includes('dailymotion.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M18.8 2.5v13.8c0 4.2-3.4 7.2-7.8 7.2-4.5 0-7.8-3.3-7.8-7.8 0-4.5 3.3-7.8 7.8-7.8 1.9 0 3.7.7 5.1 2V2.5h2.7zm-2.7 13.2c0-3-2.3-5.3-5.2-5.3-2.9 0-5.2 2.3-5.2 5.3s2.3 5.3 5.2 5.3c2.9 0 5.2-2.3 5.2-5.3z" fill="#0066DC" />
      </svg>
    );
  }

  // Veoh
  if (title === 'veoh' || url.includes('veoh.com')) {
    return (
      <svg viewBox="0 0 32 24" className="w-8 h-6 md:w-9 md:h-7 transition-all group-hover:scale-110 duration-300">
        <text x="1.5" y="17" fill="#0099FF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13">ve</text>
        <circle cx="19.5" cy="13.2" r="4.2" fill="#00B4D8" />
        <polygon points="18.5,11.2 21.5,13.2 18.5,15.2" fill="#ffffff" />
        <text x="24.5" y="17" fill="#00C49F" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13">h</text>
      </svg>
    );
  }

  // Vimeo
  if (title === 'vimeo' || url.includes('vimeo.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M22.5 6.2c-.1 2.3-1.7 5.5-4.8 9.5-3.2 4.2-5.9 6.3-8.1 6.3-1.4 0-2.6-1.3-3.6-3.8-.7-2.6-1.4-5.1-2.1-7.7-.8-2.6-1.6-3.9-2.4-3.9-.2 0-.8.4-1.9 1.2L0 8.5c1.2-1.1 2.4-2.2 3.6-3.2 1.7-1.4 2.9-2.2 3.7-2.3 1.9-.2 3.1 1.1 3.5 3.9.5 3 .8 4.9 1 5.7.6 2.7 1.3 4 2.1 4 .6 0 1.5-.9 2.7-2.7 1.2-1.8 1.8-3.1 1.9-4 .2-1.3-.4-2-1.8-2-.7 0-1.4.2-2.1.5 1.4-4.5 4.1-6.6 8-6.4 2.8.2 4.1 1.9 3.9 4.2z" fill="#1AB7EA" />
      </svg>
    );
  }

  // Beatport
  if (title === 'beatport' || url.includes('beatport.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path d="M12.5 3.5a1.8 1.8 0 0 1 1.8 1.8v6.2a5.5 5.5 0 1 1-3.6-5.2V5.3a1.8 1.8 0 0 1 1.8-1.8zm-1.8 9.2a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0-3.5-3.5z" fill="#00EC99" />
      </svg>
    );
  }

  // Soundtify (Official Website Logo)
  if (title === 'soundtify' || url.includes('soundtify')) {
    return (
      <img
        src="https://soundtify.dpdns.org/favicon.svg"
        alt="Soundtify"
        className="w-7 h-7 md:w-8 md:h-8 rounded-lg object-contain transition-all group-hover:scale-110 duration-300"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          const fallback = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="120" fill="%23512feb"/><circle cx="180" cy="210" r="36" fill="white"/><circle cx="332" cy="210" r="36" fill="white"/><path d="M150 320 Q256 430 362 320" stroke="white" stroke-width="36" stroke-linecap="round" fill="none"/></svg>';
          if (target.src !== fallback) {
            target.src = fallback;
          }
        }}
      />
    );
  }

  // Discovery (Official Website Logo)
  if (title === 'discovery' || url.includes('wisenavigation.dpdns.org') || url.includes('wisenavigation')) {
    return (
      <img
        src="https://wisenavigation.dpdns.org/images/metapanel-t.png"
        alt="Discovery"
        className="w-7 h-7 md:w-8 md:h-8 object-contain transition-all group-hover:scale-110 duration-300"
        onError={(e) => {
          const target = e.currentTarget;
          const fallback = getFavicon(link.url);
          if (fallback && target.src !== fallback) {
            target.src = fallback;
          }
        }}
      />
    );
  }

  // PurestWay (Official Website Logo)
  if (title === 'purestway' || url.includes('purestway.substack.com') || url.includes('purestway')) {
    return (
      <img
        src="https://substackcdn.com/image/fetch/$s_!kHL2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd3c839f3-03d2-4267-aeca-545261517888%2Fapple-touch-icon-180x180.png"
        alt="PurestWay"
        className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover transition-all group-hover:scale-110 duration-300"
        onError={(e) => {
          const target = e.currentTarget;
          const fallback = getFavicon(link.url);
          if (fallback && target.src !== fallback) {
            target.src = fallback;
          }
        }}
      />
    );
  }

  // Clideo (Official Website Logo)
  if (title === 'clideo' || url.includes('clideo.com') || url.includes('clideo')) {
    return (
      <svg viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300" fill="none">
        <defs>
          <linearGradient id="clideoLinearGrad" x1="0" y1="0.945312" x2="0" y2="31.0543" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3291FF" />
            <stop offset="1" stopColor="#00D58E" />
          </linearGradient>
        </defs>
        <path
          d="M24.92 12.5833C22.38 10.2943 19.57 8.24431 16.5 6.47531C13.43 4.70431 10.25 3.28531 7 2.23531C5.45 1.71531 3.88 1.29531 2.31 0.945312C1.82 2.48431 1.41 4.05531 1.08 5.65431C0.37 8.99431 0 12.4443 0 15.9933C0 19.5443 0.37 23.0033 1.08 26.3453C1.41 27.9453 1.82 29.5153 2.309 31.0543C3.879 30.7043 5.45 30.2843 6.999 29.7653C10.249 28.7143 13.429 27.3043 16.499 25.5253C19.569 23.7543 22.379 21.7053 24.919 19.4143C26.139 18.3343 27.289 17.1953 28.379 16.0043C27.29 14.8043 26.14 13.6633 24.92 12.5833ZM7 22.9253V9.07431L19 16.0033L7 22.9253Z"
          fill="url(#clideoLinearGrad)"
        />
      </svg>
    );
  }

  // RecordCast (Official Website Logo)
  if (title.toLowerCase().includes('recordcast') || url.includes('recordcast.com') || url.includes('recordcast')) {
    return (
      <img
        src="https://www.recordcast.com/templates/site/favicon.ico"
        alt="RecordCast"
        className="w-7 h-7 md:w-8 md:h-8 object-contain transition-all group-hover:scale-110 duration-300"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          const fallback = getFavicon(link.url) || 'https://www.recordcast.com/favicon.ico';
          if (fallback && target.src !== fallback) {
            target.src = fallback;
          }
        }}
      />
    );
  }

  // Apowersoft Audio Recorder (Official Website Logo)
  if (title.toLowerCase().includes('apowersoft') || url.includes('apowersoft.com') || url.includes('free-audio-recorder')) {
    return (
      <img
        src="https://cfcdn.apowersoft.info/common/apple-touch-icon/apowersoft.png"
        alt="Apowersoft"
        className="w-7 h-7 md:w-8 md:h-8 rounded-lg object-contain transition-all group-hover:scale-110 duration-300"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget;
          const fallback = 'https://www.apowersoft.com/favicon.ico';
          if (target.src !== fallback) {
            target.src = fallback;
          }
        }}
      />
    );
  }

  // Substack
  if (url.includes('substack.com') || title === 'substack') {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-[#FF671F] transition-all group-hover:scale-110 duration-300" fill="currentColor">
        <path d="M22.539 8.242H1.46V5.406h21.078v2.836zM1.46 10.881H22.54v2.834H1.46V10.88zM1.46 16.353h21.078l-10.539 6.054-10.539-6.054z"/>
      </svg>
    );
  }

  // Word
  if (title === 'word' || title === 'microsoft word' || url.includes('/launch/word')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <rect x="5.5" y="2" width="16.5" height="20" rx="2" fill="#185abd" />
        <rect x="7" y="4" width="13" height="2" rx="1" fill="#41a5ee" opacity="0.8" />
        <rect x="7" y="8" width="13" height="2" rx="1" fill="#ffffff" opacity="0.7" />
        <rect x="7" y="12" width="9" height="2" rx="1" fill="#ffffff" opacity="0.7" />
        <rect x="7" y="16" width="11" height="2" rx="1" fill="#ffffff" opacity="0.7" />
        <rect x="2" y="4.5" width="11" height="15" rx="2" fill="#103f91" />
        <path d="M4.5 7.5h1.7l1.3 5.4 1.3-5.4h1.7l-2.1 8h-1.6l-1.3-5-1.3 5h-1.6l-2.1-8z" fill="#ffffff" />
      </svg>
    );
  }

  // Excel
  if (title === 'excel' || title === 'microsoft excel' || url.includes('/launch/excel')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <rect x="5.5" y="2" width="16.5" height="20" rx="2" fill="#107c41" />
        <rect x="7" y="4.5" width="6" height="6.5" rx="0.5" fill="#33c481" opacity="0.9" />
        <rect x="14" y="4.5" width="6" height="6.5" rx="0.5" fill="#185abd" opacity="0.1" />
        <rect x="7" y="12" width="6" height="7.5" rx="0.5" fill="#ffffff" opacity="0.4" />
        <rect x="14" y="12" width="6" height="7.5" rx="0.5" fill="#33c481" opacity="0.9" />
        <rect x="2" y="4.5" width="11" height="15" rx="2" fill="#0b552b" />
        <path d="M4.5 7.5h1.9l1.6 2.8 1.6-2.8h1.9l-2.5 4 2.6 4h-1.9l-1.7-2.9-1.7 2.9h-1.9l2.6-4-2.5-4z" fill="#ffffff" />
      </svg>
    );
  }

  // OneNote
  if (title === 'onenote' || title === 'microsoft onenote' || url.includes('/launch/onenote')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <rect x="5.5" y="2" width="16.5" height="20" rx="2" fill="#7719aa" />
        <rect x="12" y="4" width="8" height="2.5" rx="0.5" fill="#b062e8" opacity="0.9" />
        <rect x="12" y="8" width="8" height="2.5" rx="0.5" fill="#b062e8" opacity="0.9" />
        <rect x="12" y="12" width="8" height="2.5" rx="0.5" fill="#b062e8" opacity="0.9" />
        <rect x="12" y="16" width="8" height="2.5" rx="0.5" fill="#b062e8" opacity="0.9" />
        <rect x="2" y="4.5" width="11" height="15" rx="2" fill="#4c0b70" />
        <path d="M4.6 7.5h1.7l3 5.4v-5.4h1.7v8h-1.7l-3-5.4v5.4h-1.7v-8z" fill="#ffffff" />
      </svg>
    );
  }

  // PowerPoint
  if (title === 'powerpoint' || title === 'microsoft powerpoint' || url.includes('/launch/powerpoint')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <rect x="5.5" y="2" width="16.5" height="20" rx="2" fill="#c43e1c" />
        <circle cx="15.5" cy="11.5" r="5" fill="#f36a43" opacity="0.9" />
        <path d="M15.5 6.5v5h5a5 5 0 0 0-5-5z" fill="#ff8f6b" />
        <rect x="2" y="4.5" width="11" height="15" rx="2" fill="#88280f" />
        <path d="M4.7 7.5h3.2c1.4 0 2.3.8 2.3 2.1 0 1.4-.9 2.2-2.3 2.2h-1.4v3.7h-1.8v-8zm1.8 1.6v2.3h1.3c.5 0 .9-.3.9-.9 0-.6-.4-1.4-.9-1.4h-1.3z" fill="#ffffff" />
      </svg>
    );
  }

  // Google Store
  if (url.includes('store.google.com')) {
    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    );
  }

  // IBM
  if (title === 'ibm' || url.includes('ibm.com')) {
    return (
      <svg viewBox="0 0 1000 401.15" className="w-8 h-8 object-contain transition-all group-hover:scale-110 duration-300" fill="#0f62fe">
        <g>
          <rect y="373.17" width="194.43" height="27.932"/>
          <rect y="319.83" width="194.43" height="27.932"/>
          <rect x="55.468" y="266.54" width="83.399" height="27.932"/>
          <rect x="55.468" y="213.25" width="83.399" height="27.932"/>
          <rect x="55.468" y="159.96" width="83.399" height="27.932"/>
          <rect x="55.468" y="106.58" width="83.399" height="27.932"/>
          <rect y="53.288" width="194.43" height="27.932"/>
          <rect width="194.43" height="27.932"/>
          <path d="m222.17 400.85 207.11 0.297c27.734 0 52.793-10.697 71.513-27.932h-278.62z"/>
          <path d="m222.17 347.76h299.03c5.051-8.617 8.815-18.027 11.094-27.932h-310.12z"/>
          <rect x="277.73" y="266.54" width="83.3" height="27.932"/>
          <path d="m444.43 266.54v27.932h90.927c0-9.608-1.288-19.017-3.764-27.932z"/>
          <path d="m497.92 213.25h-220.19v27.932h243.46c-6.34-10.698-14.165-20.107-23.277-27.932z"/>
          <path d="m277.73 159.96v27.932h220.19c9.311-7.825 17.135-17.235 23.277-27.932z"/>
          <rect x="277.73" y="106.58" width="83.3" height="27.932"/>
          <path d="m444.43 134.51h87.163c2.476-8.914 3.764-18.324 3.764-27.932h-90.927z"/>
          <path d="m521.2 53.288h-299.03v27.932h310.12c-2.575-9.905-6.339-19.314-11.093-27.932z"/>
          <path d="m429.28 0h-207.11v27.932h278.53c-18.621-17.235-43.878-27.932-71.414-27.932z"/>
          <polygon points="555.57 81.22 742.67 81.22 733.06 53.288 555.57 53.288"/>
          <polygon points="555.57 27.932 724.25 27.932 714.64 0 555.57 0"/>
          <polygon points="861.03 401.17 861.03 373.24 1000 373.24 1000 401.17"/>
          <polygon points="861.03 347.76 861.03 319.83 1000 319.83 1000 347.76"/>
          <polygon points="777.73 182.54 769.91 159.96 694.43 159.96 611.03 159.96 611.03 187.89 694.43 187.89 694.43 162.24 703.25 187.89 852.22 187.89 861.03 162.24 861.03 187.89 944.43 187.89 944.43 159.96 861.03 159.96 785.56 159.96"/>
          <polygon points="944.43 106.58 803.98 106.58 794.37 134.51 944.43 134.51"/>
          <polygon points="1000 27.932 1000 0 840.93 0 831.32 27.932"/>
          <polygon points="768.13 373.22 777.73 400.85 787.34 373.22"/>
          <polygon points="749.5 319.83 759.31 347.76 796.16 347.76 806.06 319.83"/>
          <polygon points="730.78 266.54 740.59 294.47 814.88 294.47 824.68 266.54"/>
          <polygon points="721.97 241.18 833.6 241.18 843.11 213.25 712.36 213.25"/>
          <polygon points="611.03 134.51 761.09 134.51 751.49 106.58 611.03 106.58"/>
          <polygon points="1000 53.288 822.4 53.288 812.9 81.22 1000 81.22"/>
          <rect x="555.57" y="373.22" width="138.97" height="27.932"/>
          <rect x="555.57" y="319.83" width="138.97" height="27.932"/>
          <rect x="611.03" y="266.54" width="83.399" height="27.932"/>
          <rect x="611.03" y="213.25" width="83.399" height="27.932"/>
          <rect x="861.03" y="213.25" width="83.399" height="27.932"/>
          <rect x="861.03" y="266.54" width="83.399" height="27.932"/>
        </g>
      </svg>
    );
  }

  // Favicon fallback
  const favicon = getFavicon(link.url);
  if (favicon) {
    return (
      <img 
        src={favicon} 
        alt="" 
        className={`w-7 h-7 md:w-8 md:h-8 transition-all group-hover:scale-110 duration-300 ${
          (url.includes('github.com') || 
           url.includes('tiktok.com') || 
           url.includes('netflix.com') || 
           url.includes('grok') || 
           url.includes('x.com') || 
           url.includes('twitter.com') || 
           title === 'github' || 
           title === 'tiktok' || 
           title === 'netflix' || 
           title === 'grok')
            ? 'rounded-full object-cover'
            : 'object-contain'
        }`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return <ExternalLink className="text-indigo-500" size={20} />;
};

export interface QuickLinksProps {
  language?: string;
}

export default function QuickLinks({ language = 'English' }: QuickLinksProps) {
  const [categories, setCategories] = useLocalStorage<Category[]>('GeekTabs-link-categories', DEFAULT_CATEGORIES);

  const hasMigrated = React.useRef(false);

  // Migrate Main to Home and add missing default categories
  React.useEffect(() => {
    if (hasMigrated.current) return;

    let updated = [...categories];
    let changed = false;

    if (updated.length > 0 && updated[0].name === 'Main') {
      updated[0].name = 'Home';
      changed = true;
    }

    const missingDefaults = DEFAULT_CATEGORIES.filter(
      defCat => !updated.some(cat => cat.id === defCat.id || cat.name === defCat.name)
    );

    if (missingDefaults.length > 0) {
      updated = [...updated, ...missingDefaults];
      changed = true;
    }

    // Ensure ms-office category links are updated to include all the new detailed bookmarks and order
    const msOfficeIndex = updated.findIndex(cat => cat.id === 'ms-office');
    if (msOfficeIndex !== -1) {
      const officeCat = updated[msOfficeIndex];
      const hasNewLink = officeCat.links.some(link => link.title.includes('Loop') || link.title.includes('Clipchamp'));
      const defaultMsOffice = DEFAULT_CATEGORIES.find(cat => cat.id === 'ms-office');
      if (!hasNewLink) {
        if (defaultMsOffice) {
          updated[msOfficeIndex] = {
            ...officeCat,
            links: defaultMsOffice.links
          };
          changed = true;
        }
      } else {
        // Ensure any existing links in ms-office starting with "Microsoft " are cleaned up
        let linksChanged = false;
        let cleanedLinks = officeCat.links.map(link => {
          if (link.title.startsWith('Microsoft ')) {
            linksChanged = true;
            return {
              ...link,
              title: link.title.replace(/^Microsoft\s+/, '')
            };
          }
          return link;
        });

        // Reorder first 4 links to Word -> Excel -> OneNote -> PowerPoint if present
        const wordLink = cleanedLinks.find(l => l.title.toLowerCase() === 'word');
        const excelLink = cleanedLinks.find(l => l.title.toLowerCase() === 'excel');
        const oneNoteLink = cleanedLinks.find(l => l.title.toLowerCase() === 'onenote');
        const powerPointLink = cleanedLinks.find(l => l.title.toLowerCase() === 'powerpoint');
        
        if (wordLink && excelLink && oneNoteLink && powerPointLink) {
          const coreIds = new Set([wordLink.id, excelLink.id, oneNoteLink.id, powerPointLink.id]);
          const remainingLinks = cleanedLinks.filter(l => !coreIds.has(l.id));
          const orderedFirstFour = [wordLink, excelLink, oneNoteLink, powerPointLink];
          const isSameOrder = cleanedLinks.slice(0, 4).every((l, i) => l.id === orderedFirstFour[i].id);
          if (!isSameOrder) {
            cleanedLinks = [...orderedFirstFour, ...remainingLinks];
            linksChanged = true;
          }
        }

        if (linksChanged) {
          updated[msOfficeIndex] = {
            ...officeCat,
            links: cleanedLinks
          };
          changed = true;
        }
      }
    }

    // Ensure music category exists and has all default music links, and renamed to Music
    const musicIndex = updated.findIndex(cat => cat.id === 'music' || cat.name === '音乐' || cat.name.toLowerCase() === 'music');
    const defaultMusic = DEFAULT_CATEGORIES.find(cat => cat.id === 'music');
    if (defaultMusic) {
      if (musicIndex === -1) {
        const msOfficeIdx = updated.findIndex(cat => cat.id === 'ms-office');
        if (msOfficeIdx !== -1) {
          updated.splice(msOfficeIdx + 1, 0, defaultMusic);
        } else {
          updated.push(defaultMusic);
        }
        changed = true;
      } else {
        const musicCat = updated[musicIndex];
        let nameChanged = false;
        if (musicCat.name !== 'Music') {
          nameChanged = true;
        }

        // Migrate Soundtify URL from soundtify.com to https://soundtify.dpdns.org/
        let linksChanged = false;
        let baseLinks = musicCat.links.map(l => {
          if (l.url.includes('soundtify.com') || (l.title.toLowerCase() === 'soundtify' && !l.url.includes('soundtify.dpdns.org'))) {
            linksChanged = true;
            return {
              ...l,
              url: 'https://soundtify.dpdns.org/'
            };
          }
          return l;
        });

        const existingUrls = new Set(baseLinks.map(l => l.url.toLowerCase().replace(/\/$/, '')));
        const existingTitles = new Set(baseLinks.map(l => l.title.toLowerCase()));
        const missingLinks = defaultMusic.links.filter(
          defLink => !existingUrls.has(defLink.url.toLowerCase().replace(/\/$/, '')) && !existingTitles.has(defLink.title.toLowerCase())
        );
        if (missingLinks.length > 0 || nameChanged || linksChanged) {
          updated[musicIndex] = {
            ...musicCat,
            name: 'Music',
            links: [...baseLinks, ...missingLinks]
          };
          changed = true;
        }
      }
    }

    // Ensure home category links are updated: remove Amazon, Walmart and old defaults, ensure Discovery and PurestWay are present
    const homeIndex = updated.findIndex(cat => cat.id === 'default' || cat.name === 'Home');
    if (homeIndex !== -1) {
      const homeCat = updated[homeIndex];
      const defaultHome = DEFAULT_CATEGORIES.find(cat => cat.id === 'default');
      if (defaultHome) {
        const hasAmazonOrWalmart = homeCat.links.some(
          link => link.title.toLowerCase() === 'amazon' || link.title.toLowerCase() === 'walmart'
        );
        const hasOldDefaults = homeCat.links.some(
          link => link.title === 'YouTube' || link.title === 'GitHub' || link.title === 'Gmail'
        );
        let baseLinks = homeCat.links.filter(
          l => l.title.toLowerCase() !== 'amazon' &&
               l.title.toLowerCase() !== 'walmart' &&
               l.title !== 'YouTube' &&
               l.title !== 'GitHub' &&
               l.title !== 'Gmail'
        );
        const existingUrls = new Set(baseLinks.map(l => l.url.toLowerCase().replace(/\/$/, '')));
        const existingTitles = new Set(baseLinks.map(l => l.title.toLowerCase()));
        const missingLinks = defaultHome.links.filter(
          defLink => !existingUrls.has(defLink.url.toLowerCase().replace(/\/$/, '')) && !existingTitles.has(defLink.title.toLowerCase())
        );
        if (missingLinks.length > 0 || hasAmazonOrWalmart || hasOldDefaults) {
          updated[homeIndex] = {
            ...homeCat,
            links: [...baseLinks, ...missingLinks]
          };
          changed = true;
        }
      }
    }

    // Ensure my-folders category is renamed to "AI Apps" and populated with default AI apps if missing
    const myFoldersIndex = updated.findIndex(cat => cat.id === 'my-folders');
    if (myFoldersIndex !== -1) {
      const foldersCat = updated[myFoldersIndex];
      let folderChanged = false;
      let newName = foldersCat.name;
      if (foldersCat.name === 'My Folders' || foldersCat.name !== 'AI Apps') {
        newName = 'AI Apps';
        folderChanged = true;
      }
      const hasAiApps = foldersCat.links.some(link => link.title === 'ChatGPT' || link.title === 'Gemini');
      let newLinks = foldersCat.links;
      if (!hasAiApps || foldersCat.links.length === 0) {
        const defaultMyFolders = DEFAULT_CATEGORIES.find(cat => cat.id === 'my-folders');
        if (defaultMyFolders) {
          newLinks = defaultMyFolders.links;
          folderChanged = true;
        }
      } else {
        // Explicitly check and update Zhipu AI's URL if it's pointing to the old one
        const updatedLinks = newLinks.map(link => {
          if (link.title === 'Zhipu AI' && link.url === 'https://chatglm.cn') {
            folderChanged = true;
            return { ...link, url: 'https://chat.z.ai/' };
          }
          return link;
        });
        if (folderChanged) {
          newLinks = updatedLinks;
        }
      }
      if (folderChanged) {
        updated[myFoldersIndex] = {
          ...foldersCat,
          name: newName,
          links: newLinks
        };
        changed = true;
      }
    }

    // Ensure google-apps category links are updated to include all the new Google Apps
    const googleAppsIndex = updated.findIndex(cat => cat.id === 'google-apps');
    if (googleAppsIndex !== -1) {
      const googleCat = updated[googleAppsIndex];
      const hasNewLink = googleCat.links.some(link => link.title === 'Sheets' || link.title === 'Voice' || link.title === 'Meet');
      const hasNewShopping = googleCat.links.some(link => link.title === 'Shopping' || link.title === 'One');
      if (!hasNewLink || !hasNewShopping) {
        const defaultGoogleApps = DEFAULT_CATEGORIES.find(cat => cat.id === 'google-apps');
        if (defaultGoogleApps) {
          updated[googleAppsIndex] = {
            ...googleCat,
            links: defaultGoogleApps.links
          };
          changed = true;
        }
      } else {
        // Remove Jamboard, Hangouts, and Domains explicitly
        let filteredLinks = googleCat.links.filter(link => {
          const cleanTitle = link.title.replace(/^Google\s+/, '').toLowerCase();
          const cleanUrl = link.url.toLowerCase();
          return cleanTitle !== 'jamboard' && !cleanUrl.includes('jamboard') && 
                 cleanTitle !== 'hangouts' && !cleanUrl.includes('hangouts') &&
                 cleanTitle !== 'domains' && !cleanUrl.includes('domains.google');
        });

        // Sync with any newly added defaults that might be missing
        const defaultGoogleApps = DEFAULT_CATEGORIES.find(cat => cat.id === 'google-apps');
        if (defaultGoogleApps) {
          defaultGoogleApps.links.forEach(defLink => {
            const hasLink = filteredLinks.some(l => {
              const cleanLTitle = l.title.replace(/^Google\s+/, '').toLowerCase();
              const cleanDefTitle = defLink.title.replace(/^Google\s+/, '').toLowerCase();
              const cleanLUrl = l.url.replace(/\/$/, '').toLowerCase();
              const cleanDefUrl = defLink.url.replace(/\/$/, '').toLowerCase();
              return cleanLTitle === cleanDefTitle || cleanLUrl === cleanDefUrl;
            });
            if (!hasLink) {
              filteredLinks.push(defLink);
            }
          });
        }

        const seenUrls = new Set<string>();
        const seenTitles = new Set<string>();
        const uniqueLinks = filteredLinks.filter(link => {
          const cleanTitle = link.title.replace(/^Google\s+/, '').toLowerCase();
          const cleanUrl = link.url.replace(/\/$/, '').toLowerCase();
          if (seenUrls.has(cleanUrl) || seenTitles.has(cleanTitle)) {
            return false;
          }
          seenUrls.add(cleanUrl);
          seenTitles.add(cleanTitle);
          return true;
        });
        
        let linksChanged = googleCat.links.length !== uniqueLinks.length;
        const cleanedLinks = uniqueLinks.map(link => {
          let updatedLink = { ...link };
          let titleModified = false;
          if (updatedLink.title.startsWith('Google ')) {
            updatedLink.title = updatedLink.title.replace(/^Google\s+/, '');
            titleModified = true;
          }
          if ((updatedLink.title === 'Collections' || updatedLink.url.includes('google.com/save')) && updatedLink.title !== 'Saved') {
            updatedLink.title = 'Saved';
            titleModified = true;
          }
          if (titleModified) {
            linksChanged = true;
          }
          return updatedLink;
        });

        if (linksChanged) {
          updated[googleAppsIndex] = {
            ...googleCat,
            links: cleanedLinks
          };
          changed = true;
        }
      }
    }

    // Ensure shopping category exists and has all 33 default shopping links
    const shoppingIndex = updated.findIndex(cat => cat.id === 'shopping' || cat.name.toLowerCase() === 'shopping');
    const defaultShopping = DEFAULT_CATEGORIES.find(cat => cat.id === 'shopping');
    if (defaultShopping) {
      if (shoppingIndex === -1) {
        const toolsIdx = updated.findIndex(cat => cat.id === 'tools');
        if (toolsIdx !== -1) {
          updated.splice(toolsIdx, 0, defaultShopping);
        } else {
          updated.push(defaultShopping);
        }
        changed = true;
      } else {
        const shoppingCat = updated[shoppingIndex];
        const existingUrls = new Set(shoppingCat.links.map(l => l.url.toLowerCase()));
        const existingTitles = new Set(shoppingCat.links.map(l => l.title.toLowerCase()));
        const missingLinks = defaultShopping.links.filter(
          defLink => !existingUrls.has(defLink.url.toLowerCase()) && !existingTitles.has(defLink.title.toLowerCase())
        );
        if (missingLinks.length > 0) {
          updated[shoppingIndex] = {
            ...shoppingCat,
            links: [...shoppingCat.links, ...missingLinks]
          };
          changed = true;
        }
      }
    }

    // Ensure travel category exists and has all default travel links
    const travelIndex = updated.findIndex(cat => cat.id === 'travel' || cat.name.toLowerCase() === 'travel');
    const defaultTravel = DEFAULT_CATEGORIES.find(cat => cat.id === 'travel');
    if (defaultTravel) {
      if (travelIndex === -1) {
        const toolsIdx = updated.findIndex(cat => cat.id === 'tools');
        if (toolsIdx !== -1) {
          updated.splice(toolsIdx, 0, defaultTravel);
        } else {
          updated.push(defaultTravel);
        }
        changed = true;
      } else {
        const travelCat = updated[travelIndex];
        let travelLinksChanged = false;
        
        // Remove Hotellook if present and rename Trip.com (Ctrip) -> Trip.com
        let cleanedLinks = travelCat.links.filter(l => {
          const isHotellook = l.title.toLowerCase().includes('hotellook') || l.url.toLowerCase().includes('hotellook');
          if (isHotellook) travelLinksChanged = true;
          return !isHotellook;
        }).map(l => {
          if (l.title === 'Trip.com (Ctrip)') {
            travelLinksChanged = true;
            return { ...l, title: 'Trip.com' };
          }
          return l;
        });

        const existingUrls = new Set(cleanedLinks.map(l => l.url.toLowerCase()));
        const existingTitles = new Set(cleanedLinks.map(l => l.title.toLowerCase()));
        const missingLinks = defaultTravel.links.filter(
          defLink => !existingUrls.has(defLink.url.toLowerCase()) && !existingTitles.has(defLink.title.toLowerCase())
        );
        if (missingLinks.length > 0) {
          cleanedLinks = [...cleanedLinks, ...missingLinks];
          travelLinksChanged = true;
        }

        if (travelLinksChanged) {
          updated[travelIndex] = {
            ...travelCat,
            links: cleanedLinks
          };
          changed = true;
        }
      }
    }

    // Ensure tech category exists and has all default tech links, and renamed to Technology
    const techIndex = updated.findIndex(cat => cat.id === 'tech' || cat.name.toLowerCase() === 'tech' || cat.name.toLowerCase() === 'technology');
    const defaultTech = DEFAULT_CATEGORIES.find(cat => cat.id === 'tech');
    if (defaultTech) {
      if (techIndex === -1) {
        const toolsIdx = updated.findIndex(cat => cat.id === 'tools');
        if (toolsIdx !== -1) {
          updated.splice(toolsIdx, 0, defaultTech);
        } else {
          updated.push(defaultTech);
        }
        changed = true;
      } else {
        const techCat = updated[techIndex];
        let nameChanged = false;
        if (techCat.name !== 'Technology') {
          nameChanged = true;
        }
        const existingUrls = new Set(techCat.links.map(l => l.url.toLowerCase()));
        const existingTitles = new Set(techCat.links.map(l => l.title.toLowerCase()));
        const missingLinks = defaultTech.links.filter(
          defLink => !existingUrls.has(defLink.url.toLowerCase()) && !existingTitles.has(defLink.title.toLowerCase())
        );
        if (missingLinks.length > 0 || nameChanged) {
          updated[techIndex] = {
            ...techCat,
            name: 'Technology',
            links: [...techCat.links, ...missingLinks]
          };
          changed = true;
        }
      }
    }

    // Ensure tools category exists and has all default tools links (including Clideo, RecordCast, Apowersoft)
    const toolsIndex = updated.findIndex(cat => cat.id === 'tools' || cat.name.toLowerCase() === 'tools');
    const defaultTools = DEFAULT_CATEGORIES.find(cat => cat.id === 'tools');
    if (defaultTools) {
      if (toolsIndex === -1) {
        updated.push(defaultTools);
        changed = true;
      } else {
        const toolsCat = updated[toolsIndex];
        const existingUrls = new Set(toolsCat.links.map(l => l.url.toLowerCase().replace(/\/$/, '')));
        const existingTitles = new Set(toolsCat.links.map(l => l.title.toLowerCase()));
        const missingLinks = defaultTools.links.filter(
          defLink => !existingUrls.has(defLink.url.toLowerCase().replace(/\/$/, '')) && !existingTitles.has(defLink.title.toLowerCase())
        );
        if (missingLinks.length > 0) {
          updated[toolsIndex] = {
            ...toolsCat,
            links: [...toolsCat.links, ...missingLinks]
          };
          changed = true;
        }
      }
    }

    // Universal sync: ensure all default categories contain their full canonical default bookmarks
    DEFAULT_CATEGORIES.forEach(defCat => {
      const catIdx = updated.findIndex(c => c.id === defCat.id || c.name.toLowerCase() === defCat.name.toLowerCase());
      if (catIdx !== -1) {
        const cat = updated[catIdx];
        const existingUrls = new Set(cat.links.map(l => l.url.toLowerCase().replace(/\/$/, '')));
        const existingTitles = new Set(cat.links.map(l => l.title.toLowerCase()));
        const missing = defCat.links.filter(
          dl => !existingUrls.has(dl.url.toLowerCase().replace(/\/$/, '')) && !existingTitles.has(dl.title.toLowerCase())
        );
        if (missing.length > 0) {
          updated[catIdx] = {
            ...cat,
            links: [...cat.links, ...missing]
          };
          changed = true;
        }
      }
    });

    if (changed) {
      setCategories(updated);
    }
    hasMigrated.current = true;
  }, [categories, setCategories]);

  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || 'default');
  const [showAdd, setShowAdd] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null);
  const [confirmDeleteLinkItem, setConfirmDeleteLinkItem] = useState<string | null>(null);

  const hiddenMeasureRef = useRef<HTMLDivElement>(null);
  const [standardCategoryWidth, setStandardCategoryWidth] = useState<number>(180);
  const [isMobile, setIsMobile] = useState<boolean>(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!hiddenMeasureRef.current) return;
    const children = Array.from(hiddenMeasureRef.current.children) as HTMLElement[];
    let maxW = 180;
    children.forEach((el) => {
      const w = Math.ceil(el.getBoundingClientRect().width);
      if (w > maxW) maxW = w;
    });
    setStandardCategoryWidth(maxW);
  }, [categories]);

  const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    const link: Link = {
      id: Date.now().toString(),
      title: newTitle,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
    };
    
    setCategories(categories.map(c => 
      c.id === activeCategoryId 
        ? { ...c, links: [...c.links, link] }
        : c
    ));
    
    setNewTitle('');
    setNewUrl('');
    setShowAdd(false);
  };

  const removeLink = (id: string) => {
    setCategories(categories.map(c => 
      c.id === activeCategoryId 
        ? { ...c, links: c.links.filter(l => l.id !== id) }
        : c
    ));
    setConfirmDeleteLinkItem(null);
  };

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || categories.length >= 12) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      links: []
    };
    setCategories([...categories, newCat]);
    setActiveCategoryId(newCat.id);
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const removeCategory = (id: string) => {
    if (categories.length <= 1) return;
    const newCats = categories.filter(c => c.id !== id);
    setCategories(newCats);
    if (activeCategoryId === id) {
      setActiveCategoryId(newCats[0].id);
    }
    setConfirmDeleteCat(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      {/* Hidden element to measure natural width of the longest category text */}
      <div
        ref={hiddenMeasureRef}
        className="absolute invisible -left-[9999px] top-0 pointer-events-none flex flex-col"
        aria-hidden="true"
      >
        {categories.map((cat) => (
          <div
            key={`measure-${cat.id}`}
            className="px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
          >
            {cat.name}
          </div>
        ))}
        <div className="px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
          Microsoft Office
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center items-center gap-2.5 mb-12">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group/cat shrink-0"
            >
              <button
                onClick={() => setActiveCategoryId(cat.id)}
                style={{ width: `${standardCategoryWidth}px`, height: '38px' }}
                className={`bookmark-cat-pill px-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center text-center cursor-pointer select-none ${
                  activeCategoryId === cat.id
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white dark:bg-[#202025] text-neutral-800 dark:text-white/90 border border-neutral-200/80 dark:border-white/10 opacity-70 hover:opacity-100'
                }`}
                title={cat.name}
              >
                <span className="truncate whitespace-nowrap px-1">{cat.name}</span>
              </button>
              {categories.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteCat(cat.id); }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity"
                >
                  <X size={8} />
                </button>
              )}
            </motion.div>
          ))}
          {categories.length < 12 && (
            <div className="w-full md:w-auto flex justify-center shrink-0">
              <button
                onClick={() => setShowAddCategory(true)}
                style={{
                  width: isMobile ? `${standardCategoryWidth}px` : undefined,
                  height: '38px',
                  '--standard-cat-width': `${standardCategoryWidth}px`,
                } as React.CSSProperties}
                className="bookmark-cat-pill bookmark-add-cat-btn h-[38px] px-4 rounded-full border border-dashed border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-white/90 opacity-70 hover:opacity-100 hover:border-indigo-500/50 hover:text-indigo-500 transition-all bg-white dark:bg-[#202025] flex items-center justify-center shrink-0 cursor-pointer select-none"
                title="Add Category"
                aria-label="Add Category"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {activeCategory?.links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              layout
              className="group relative w-full"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.description || link.title}
                className="bookmark-webcard w-full h-16 flex items-center gap-3.5 px-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#202025] hover:border-indigo-500/40 hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center justify-center shrink-0 w-9 h-9">
                  {renderBookmarkBrandIcon(link)}
                </div>
                <span 
                  className="bookmark-link-title text-black dark:text-black font-medium text-xs sm:text-sm truncate text-left flex-1 select-none"
                  style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
                >
                  {link.title}
                </span>
              </a>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setConfirmDeleteLinkItem(link.id); }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/10 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all dark:text-white/60 z-10"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}

          <div className="group relative w-full">
            <motion.button
              onClick={() => setShowAdd(true)}
              className="bookmark-webcard w-full h-16 flex items-center gap-3.5 px-4 rounded-xl border border-neutral-200/80 dark:border-white/10 bg-white dark:bg-[#202025] hover:border-indigo-500/40 hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 overflow-hidden text-left"
            >
              <div className="flex items-center justify-center shrink-0 w-9 h-9">
                <Plus size={22} className="text-indigo-500 transition-transform group-hover:rotate-90 duration-300" />
              </div>
              <span 
                className="bookmark-link-title text-black dark:text-black font-medium text-xs sm:text-sm truncate text-left flex-1 select-none"
                style={{ color: '#000000', WebkitTextFillColor: '#000000' }}
              >
                {LINKS_T[language]?.addBookmark || LINKS_T.English.addBookmark}
              </span>
            </motion.button>
          </div>
        </AnimatePresence>
      </div>

      {/* Add Link Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAdd(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative z-10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl GeekTabs-card"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {LINKS_T[language]?.addBookmark || LINKS_T.English.addBookmark}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-white/30 mb-8">
              {LINKS_T[language]?.saveTo || LINKS_T.English.saveTo} {activeCategory.name}
            </p>
            <form onSubmit={addLink} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-600 dark:text-white/40 mb-3 font-bold">
                  {LINKS_T[language]?.titleLabel || LINKS_T.English.titleLabel}
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder={LINKS_T[language]?.placeholderTitle || LINKS_T.English.placeholderTitle}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-600 dark:text-white/40 mb-3 font-bold">
                  {LINKS_T[language]?.urlLabel || LINKS_T.English.urlLabel}
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder={LINKS_T[language]?.placeholderUrl || LINKS_T.English.placeholderUrl}
                />
              </div>
              <div className="flex gap-4 pt-4 text-[10px] font-bold tracking-widest uppercase">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 px-8 py-4 bg-black/5 dark:bg-white/5 word-color rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all font-bold"
                >
                  {LINKS_T[language]?.cancel || LINKS_T.English.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all"
                >
                  {LINKS_T[language]?.addBookmark || LINKS_T.English.addBookmark}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowAddCategory(false)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative z-10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl GeekTabs-card"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {LINKS_T[language]?.newCategory || LINKS_T.English.newCategory}
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-white/30 mb-8">
              {LINKS_T[language]?.createCategoryDesc || LINKS_T.English.createCategoryDesc}
            </p>
            <form onSubmit={addCategory} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-slate-600 dark:text-white/40 mb-3 font-bold">
                  {LINKS_T[language]?.categoryName || LINKS_T.English.categoryName}
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder={LINKS_T[language]?.placeholderCategory || LINKS_T.English.placeholderCategory}
                />
              </div>
              <div className="flex gap-4 pt-4 text-[10px] font-bold tracking-widest uppercase">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="flex-1 px-8 py-4 bg-black/5 dark:bg-white/5 word-color rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-all font-bold"
                >
                  {LINKS_T[language]?.cancel || LINKS_T.English.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold transition-all"
                >
                  {LINKS_T[language]?.create || LINKS_T.English.create}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <ConfirmModal
        isOpen={!!confirmDeleteCat}
        title={LINKS_T[language]?.deleteCategoryTitle || LINKS_T.English.deleteCategoryTitle}
        message={LINKS_T[language]?.deleteCategoryMsg || LINKS_T.English.deleteCategoryMsg}
        onConfirm={() => confirmDeleteCat && removeCategory(confirmDeleteCat)}
        onCancel={() => setConfirmDeleteCat(null)}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteLinkItem}
        title={LINKS_T[language]?.deleteBookmarkTitle || LINKS_T.English.deleteBookmarkTitle}
        message={LINKS_T[language]?.deleteBookmarkMsg || LINKS_T.English.deleteBookmarkMsg}
        onConfirm={() => confirmDeleteLinkItem && removeLink(confirmDeleteLinkItem)}
        onCancel={() => setConfirmDeleteLinkItem(null)}
      />
    </div>
  );
}
