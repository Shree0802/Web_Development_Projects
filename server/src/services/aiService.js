// AI Tourism Service for Kolhapur Tourism Discovery & Travel Planning Platform
// Supports Google Gemini (gemini-1.5-flash / gemini-2.0-flash), OpenAI (gpt-4o-mini / gpt-3.5-turbo),
// and an intelligent local ground-truth fallback engine grounded in verified Kolhapur facts.

const initialData = require('../data/initialData');

// Ground-truth facts extracted from the verified Kolhapur Tourism database
const KOLHAPUR_GROUND_TRUTH = `
OFFICIAL KOLHAPUR TOURISM VERIFIED KNOWLEDGE BASE:

1. SACRED & SPIRITUAL LANDMARKS:
- Shri Mahalakshmi (Ambabai) Temple: 7th-century Hemadpanthi basalt temple constructed under Chalukya dynasty. Open 5:00 AM - 10:00 PM. Kiranotsav occurs in Jan-Feb & Nov when setting sun rays illuminate the idol. Footwear counters at Mahadwar. Traditional modest attire requested.
- Jyotiba Temple (Wadi Ratnagiri): 3,124 ft hill shrine dedicated to Jyotiba (avatar of Shiva, Vishnu, Brahma, and Jamadagni). Known for 'Gulal' offerings and sacred pink dust during Chaitra Purnima. 18 km from city.
- Kopeshwar Temple (Khidrapur): 12th-century Silahara-era marvel on the banks of Krishna River (60 km east). Features the circular open-sky 'Swargamandap' supported by 48 intricately carved stone pillars, plus 95 carved elephants on the outer plinth.
- Narsobawadi: Confluence of Krishna and Panchganga rivers, seat of Dattatreya worship, famed for authentic Basundi and Kavathekar Peda.
- Bahubali Kumbhojgiri: Digambara Jain pilgrimage featuring a 28-ft monolithic statue of Lord Bahubali atop the Vanki hill.

2. ROYAL FORTS & PALACES:
- Panhala Fort: 20 km northwest of Kolhapur, 3,127 ft above sea level. Key structures: Sajja Kothi (where Sambhaji was kept), Ambarkhana (granary with 25,000 khandis capacity), Teen Darwaja, and the heroics of Shiva Kashid and Baji Prabhu Deshpande.
- New Palace & Chhatrapati Shahu Maharaj Museum: Designed by Major Mant in Indo-Saracenic style using black stone. Open 9:30 AM to 5:30 PM (Closed Mondays). Houses royal weaponry, taxidermy collections, and the grand octagonal Durbar Hall with stained glass.
- Bhavani Mandap: Ancient royal palace and headquarters of Kolhapur state. Houses statue of Shahu Maharaj and royal carriage. Located directly adjacent to Ambabai Temple.
- Vishalgad Fort: Historic cliff fortress 76 km northwest in the Sahyadri mountains, famous for the Pavankhind rearguard stand.

3. SCENIC NATURE & LEISURE:
- Rankala Lake: Historic stone-quarry-turned-lake commissioned by King Gandaraditya. Features Padmapath walkway, Shalini Palace view, evening boating, and Chowpatty stalls.
- Radhanagari Wildlife Sanctuary: UNESCO Western Ghats biodiversity hotspot, first sanctuary of Maharashtra, home to the Indian Bison (Gaur), tigers, and Malabar giant squirrels.
- Dajipur Bison Sanctuary & Rautwadi Waterfalls: Eco-tourism base camp 80 km from Kolhapur.
- Kalamwadi Dam: Massive reservoir on Dudhganga river with hydro-electric generation and lush surrounding forest hills.

4. GASTRONOMY & AUTHENTIC EATERIES:
- Kolhapuri Misal: Fiery sprout curry with Kolhapuri Kanda-Lahsun masala, farsan, and butter pav. Famous authentic spots: Phadtare Misal (Udyamnagar), Bawada Misal (Kasba Bawada), Chhatrapati Khasbag Misal, and Aahar Misal.
- Non-Veg Thali (Tambda & Pandhra Rassa): Spicy mutton sukka with clear red chili broth (Tambda Rassa) and mild coconut-milk-based white broth (Pandhra Rassa). Famous spots: Opal Hotel (Old Pune-Bangalore Road), Padma Guest House (Laxmipuri), Hotel Parakh, and Deval Club.
- Kolhapuri Bhel: Rajabhau Bhel on Khasbag and Rankala Chowpatty bhel.

5. CRAFTS, CULTURE & SPORTS:
- Kolhapuri Chappals: Hand-stitched, 100% vegetable-tanned leather footwear with GI tag. Best shopping at Mahadwar Road, Bhausinghji Road, and Shivaji Market.
- Kolhapuri Saaj: Traditional royal necklace with 21 auspicious elements and stone carvings. Found at Gujari gold market.
- Traditional Kushti (Indian Wrestling): Historic red-mud Taleems (Gangavesh Talim, Motibag Talim, Shahupuri Talim). Kolhapur is the "Mecca of Indian Wrestling", patronized by Rajarshi Shahu Maharaj.
`;

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  hasLiveApiKey() {
    if (this.provider === 'gemini' && this.geminiApiKey && this.geminiApiKey.trim() !== '') return true;
    if (this.provider === 'openai' && this.openaiApiKey && this.openaiApiKey.trim() !== '') return true;
    return false;
  }

  /**
   * Generates a day-by-day customized travel itinerary using live AI or the expert ground-truth engine.
   */
  async generateItinerary(params) {
    const {
      durationDays = 2,
      pace = 'balanced',
      interests = ['temples', 'history', 'food', 'nature'],
      travelersCount = 2,
      budgetLevel = 'moderate',
      startingLocation = 'Kolhapur Railway Station'
    } = params;

    const days = Math.min(Math.max(parseInt(durationDays, 10) || 2, 1), 7);

    // If live Gemini or OpenAI key is present, attempt live AI generation
    if (this.hasLiveApiKey()) {
      try {
        const prompt = `You are the Official AI Travel Architect for Kolhapur Tourism in Maharashtra, India.
Generate a structured, authentic ${days}-day travel itinerary for ${travelersCount} travelers.
Pace: ${pace} (e.g. relaxed, balanced, or intensive).
Interests: ${interests.join(', ')}.
Budget Tier: ${budgetLevel} (budget, moderate, or luxury).
Starting Point: ${startingLocation}.

KNOWLEDGE GROUNDING:
${KOLHAPUR_GROUND_TRUTH}

RULES:
1. Only recommend REAL, verified Kolhapur locations from the knowledge base above.
2. Group attractions by real geographical proximity (e.g. Ambabai + Bhavani Mandap + New Palace on one day; Panhala + Jyotiba on another day).
3. Include specific local meals (Misal for breakfast, Tambda/Pandhra Rassa for lunch/dinner).
4. Return ONLY a valid JSON object matching this exact schema:
{
  "planTitle": "string",
  "summary": "string",
  "durationDays": ${days},
  "pace": "${pace}",
  "budgetLevel": "${budgetLevel}",
  "estimatedTotalBudget": number (in INR for all travelers combined),
  "costBreakdown": { "accommodation": number, "food": number, "transport": number, "activities": number },
  "days": [
    {
      "day": 1,
      "title": "string",
      "theme": "string",
      "summary": "string",
      "activities": [
        {
          "time": "08:00 AM - 10:30 AM",
          "destinationName": "string",
          "category": "temple|history|nature|food|craft",
          "duration": "string",
          "highlight": "string",
          "travelTip": "string",
          "estimatedCost": number
        }
      ]
    }
  ],
  "expertTips": ["string", "string", "string"]
}`;

        let aiResult = null;
        if (this.provider === 'gemini' && this.geminiApiKey) {
          aiResult = await this.callGemini(prompt, true);
        } else if (this.provider === 'openai' && this.openaiApiKey) {
          aiResult = await this.callOpenAI(prompt, true);
        }

        if (aiResult) {
          const parsed = typeof aiResult === 'string' ? JSON.parse(aiResult) : aiResult;
          return {
            success: true,
            source: `Live AI (${this.provider.toUpperCase()})`,
            aiGenerated: true,
            ...parsed
          };
        }
      } catch (err) {
        console.warn('Live AI itinerary generation failed, seamlessly falling back to curated expert engine:', err.message);
      }
    }

    // High-performance ground-truth curated fallback
    return this.generateGroundTruthItinerary(days, pace, interests, budgetLevel, travelersCount);
  }

  /**
   * Interactive AI Tourism Assistant chat endpoint.
   */
  async chatAssistant(messages, userQuestion) {
    if (this.hasLiveApiKey()) {
      try {
        const systemPrompt = `You are 'Shahu Margdarshak', the official, friendly, and deeply knowledgeable AI Tourism Assistant for Kolhapur, Maharashtra, India.
You speak warmly, with occasional welcome Marathi phrases like 'नमस्कार (Namaskar)', 'जय भवानी जय शिवाजी (Jai Bhavani Jai Shivaji)', or 'स्वागत आहे (Swagat Aahe)'.

YOUR KNOWLEDGE BASE:
${KOLHAPUR_GROUND_TRUTH}

RULES:
1. Give accurate, practical advice: timings, ticket prices, best photography hours, dress codes, misal spots, and taxi/auto tips.
2. If asked about places outside Kolhapur district, politely clarify that your expertise is concentrated on Kolhapur, Panhala, Jyotiba, Radhanagari, and Kopeshwar.
3. Be enthusiastic, helpful, and concise. Use clear bullet points and bold titles.`;

        let chatReply = '';
        if (this.provider === 'gemini' && this.geminiApiKey) {
          const formattedPrompt = `${systemPrompt}\n\nUser Question: ${userQuestion}`;
          chatReply = await this.callGemini(formattedPrompt, false);
        } else if (this.provider === 'openai' && this.openaiApiKey) {
          chatReply = await this.callOpenAI(`${systemPrompt}\n\nUser Question: ${userQuestion}`, false);
        }

        if (chatReply && chatReply.trim() !== '') {
          return {
            success: true,
            source: `Live AI (${this.provider.toUpperCase()})`,
            reply: chatReply
          };
        }
      } catch (err) {
        console.warn('Live AI chat failed, falling back to expert response generator:', err.message);
      }
    }

    // Rule-based, context-rich intelligent fallback assistant
    return this.generateGroundTruthChatReply(userQuestion);
  }

  /**
   * Helper: Call Google Gemini REST API
   */
  async callGemini(prompt, expectJson = false) {
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2500,
        responseMimeType: expectJson ? "application/json" : "text/plain"
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('No candidate content received from Gemini.');
    
    if (expectJson) {
      // Remove any accidental markdown backticks
      const cleanJson = candidate.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      return JSON.parse(cleanJson);
    }
    return candidate;
  }

  /**
   * Helper: Call OpenAI REST API
   */
  async callOpenAI(prompt, expectJson = false) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      response_format: expectJson ? { type: "json_object" } : { type: "text" }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error('No message received from OpenAI.');

    if (expectJson) {
      return JSON.parse(reply);
    }
    return reply;
  }

  /**
   * Ground-truth curated fallback itinerary generator
   */
  generateGroundTruthItinerary(days, pace, interests, budgetLevel, travelersCount) {
    const plansPool = [
      {
        day: 1,
        title: "Heart of Kolhapur: Sacred Ambabai, Royal Palace & Sunset by Rankala",
        theme: "Heritage & Living Culture",
        summary: "Discover the spiritual core and royal Maratha lineage of the city, culminating in a breezy lakeside sunset.",
        activities: [
          {
            time: "07:30 AM - 10:00 AM",
            destinationName: "Shri Mahalakshmi (Ambabai) Temple",
            category: "temple",
            duration: "2.5 Hours",
            highlight: "Attend early morning Kakad Aarti and observe the Chalukyan basalt stone Hemadpanthi architecture.",
            travelTip: "Traditional modest attire recommended; deposit footwear at the Mahadwar counter.",
            estimatedCost: 0
          },
          {
            time: "10:15 AM - 11:30 AM",
            destinationName: "Bhavani Mandap & Heritage Bazaar",
            category: "history",
            duration: "1 Hour",
            highlight: "View the royal Maratha weapons, royal carriage, and shop for authentic GI-tagged Kolhapuri Chappals.",
            travelTip: "Bargain politely and verify vegetable-tanned leather soles.",
            estimatedCost: 1500
          },
          {
            time: "12:00 PM - 01:30 PM",
            destinationName: "Culinary Trail: Phadtare Misal or Traditional Thali",
            category: "food",
            duration: "1.5 Hours",
            highlight: "Savor world-famous Kolhapuri Misal or tender mutton thali with unlimited Tambda and Pandhra Rassa.",
            travelTip: "Phadtare in Udyamnagar closes by 2:00 PM.",
            estimatedCost: 450 * travelersCount
          },
          {
            time: "02:30 PM - 04:30 PM",
            destinationName: "New Palace & Chhatrapati Shahu Maharaj Museum",
            category: "history",
            duration: "2 Hours",
            highlight: "Marvel at Indo-Saracenic black stone architecture, stained-glass Durbar Hall, and royal memorabilia.",
            travelTip: "Entry ticket is ₹50 per person; photography inside the museum rooms is restricted.",
            estimatedCost: 50 * travelersCount
          },
          {
            time: "05:00 PM - 07:30 PM",
            destinationName: "Rankala Lake Promenade & Boating",
            category: "nature",
            duration: "2.5 Hours",
            highlight: "Enjoy pedal boating, panoramic views of Shalini Palace, and hot street bhel on the lakeside chowpatty.",
            travelTip: "Ideal evening photography spot as the sun sets over the historic water body.",
            estimatedCost: 100 * travelersCount
          }
        ]
      },
      {
        day: 2,
        title: "Maratha Fortresses & Western Ghats: Panhala & Jyotiba Hill",
        theme: "Fortresses & Panoramic Vistas",
        summary: "Ascend the misty Sahyadri ramparts of Panhala Fort and visit the sacred hilltop shrine of Jyotiba.",
        activities: [
          {
            time: "08:00 AM - 12:30 PM",
            destinationName: "Panhala Fort (Sajja Kothi & Ambarkhana)",
            category: "history",
            duration: "4 Hours",
            highlight: "Walk through Teen Darwaja, explore granaries of Ambarkhana, and pay homage at Shiva Kashid's Samadhi.",
            travelTip: "Wear comfortable walking shoes with good grip on historic stone steps.",
            estimatedCost: 200
          },
          {
            time: "01:00 PM - 02:30 PM",
            destinationName: "Hillside Dhaba Lunch (Pithla Bhakri & Thecha)",
            category: "food",
            duration: "1.5 Hours",
            highlight: "Relish freshly ground rustic Jowar bhakri, green chili thecha, and fresh curd.",
            travelTip: "Ask for jaggery cubes (Kolhapuri Gul) for an authentic sweet finish.",
            estimatedCost: 250 * travelersCount
          },
          {
            time: "03:30 PM - 05:30 PM",
            destinationName: "Jyotiba Temple (Wadi Ratnagiri)",
            category: "temple",
            duration: "2 Hours",
            highlight: "Experience the vibrant sea of pink Gulal and panoramic 360-degree views from 3,124 ft.",
            travelTip: "Wadi Ratnagiri hill road has scenic hairpin bends; drive carefully.",
            estimatedCost: 100
          },
          {
            time: "06:30 PM - 08:30 PM",
            destinationName: "Gangavesh Red-Mud Taleem (Kushti Akhara)",
            category: "craft",
            duration: "2 Hours",
            highlight: "Witness traditional red-soil wrestling bouts where champions train in heritage earthen pits.",
            travelTip: "Evening training sessions typically begin around 5:30 PM.",
            estimatedCost: 0
          }
        ]
      },
      {
        day: 3,
        title: "Ancient Stone Wonders: Kopeshwar Khidrapur & Confluence of Rivers",
        theme: "Architectural Marvel & Sacred Confluence",
        summary: "Journey to the celestial open-sky Swargamandap at Khidrapur and the serene banks of Narsobawadi.",
        activities: [
          {
            time: "08:30 AM - 12:00 PM",
            destinationName: "Kopeshwar Temple (Khidrapur)",
            category: "history",
            duration: "3.5 Hours",
            highlight: "Marvel at the circular open-sky Swargamandap, 95 carved elephants, and intricate Chalukya sculptures.",
            travelTip: "Carry wide-angle camera lens; Khidrapur is 60 km from Kolhapur (approx 1.5 hr drive).",
            estimatedCost: 100
          },
          {
            time: "01:00 PM - 03:00 PM",
            destinationName: "Narsobawadi Sacred Ghats & Peda Tasting",
            category: "temple",
            duration: "2 Hours",
            highlight: "Visit the holy Dattatreya temple at the Krishna-Panchganga confluence and taste authentic Kavathekar peda.",
            travelTip: "Boat rides across the river are available during calm river seasons.",
            estimatedCost: 200 * travelersCount
          },
          {
            time: "04:30 PM - 07:00 PM",
            destinationName: "Mahadwar Road & Gujari Shopping Trail",
            category: "craft",
            duration: "2.5 Hours",
            highlight: "Shop directly from certified generational cobblers and view handcrafted 21-element Kolhapuri Saaj jewelry.",
            travelTip: "Look for authentic GI tag embossed stamps on chappal soles.",
            estimatedCost: 2000
          }
        ]
      }
    ];

    const selectedDays = plansPool.slice(0, days);
    const perDayCost = budgetLevel === 'luxury' ? 4500 : budgetLevel === 'budget' ? 1200 : 2500;
    const totalEstimate = perDayCost * days * travelersCount;

    return {
      success: true,
      source: "Kolhapur Expert Curation Engine",
      aiGenerated: false,
      planTitle: `${days}-Day ${pace.toUpperCase()} Kolhapur Exploration (${budgetLevel.toUpperCase()} Tier)`,
      durationDays: days,
      pace,
      budgetLevel,
      travelersCount,
      estimatedTotalBudget: totalEstimate,
      costBreakdown: {
        accommodation: Math.round(totalEstimate * 0.45),
        food: Math.round(totalEstimate * 0.25),
        transport: Math.round(totalEstimate * 0.20),
        activities: Math.round(totalEstimate * 0.10)
      },
      summary: `A masterfully balanced ${days}-day itinerary crafted according to real geographic travel corridors, authentic dining traditions, and historic heritage sites.`,
      days: selectedDays,
      expertTips: [
        "Pre-book temple passes online during peak festive seasons (Navratri and Diwali).",
        "Tambda Rassa is spicy and hot; Pandhra Rassa is mild and coconut-based - balance both during meals.",
        "Auto-rickshaws generally run on meters inside the city; clarify fares for Panhala and Jyotiba round-trips upfront."
      ]
    };
  }

  /**
   * Ground-truth conversational fallback
   */
  generateGroundTruthChatReply(question) {
    const q = (question || '').toLowerCase();

    if (q.includes('misal') || q.includes('food') || q.includes('rassa') || q.includes('eat') || q.includes('restaurant')) {
      return {
        success: true,
        source: "Kolhapur Expert Assistant",
        reply: `### 🍛 Kolhapur's Legendary Culinary Recommendations

**1. The Holy Trinity of Misal:**
- **Phadtare Misal (Udyamnagar):** Kolhapur's gold standard. Cooked in pure peanut oil, served with crisp bread loafs. Opens 7:30 AM to 2:00 PM.
- **Bawada Misal (Kasba Bawada):** Famous for its distinctive aromatic garlic-onion 'kat' broth.
- **Khasbag Misal:** Served right by the historic wrestling arena.

**2. Authentic Tambda & Pandhra Rassa (Non-Veg Thali):**
- **Hotel Opal (Pune-Bangalore Hwy):** Famed for royal Kolhapuri mutton thalis with free-flowing broths.
- **Padma Guest House (Laxmipuri):** Over 75 years of royal family recipes.
- **Hotel Parakh:** Renowned for tender Mutton Sukka and authentic Bhakri.

*Travel Tip: Always ask for 'Medium Kat' if you have lower tolerance to fiery Lavangi chillies!*`
      };
    }

    if (q.includes('temple') || q.includes('darshan') || q.includes('ambabai') || q.includes('mahalakshmi') || q.includes('timings')) {
      return {
        success: true,
        source: "Kolhapur Expert Assistant",
        reply: `### 🛕 Shri Mahalakshmi (Ambabai) Temple Guide

**Timings & Worship Schedule:**
- **Temple Opens:** 5:00 AM
- **Kakad Aarti:** 5:30 AM
- **Abhishek & Puja:** 8:00 AM - 12:00 PM
- **Alankar / Mahapuja:** 4:00 PM
- **Shej Aarti:** 10:00 PM

**Important Visitor Tips:**
1. **Dress Code:** Traditional modest attire is requested (dhotis/kurta for men, sarees/salwar for women).
2. **Footwear:** Safe free shoe stands are maintained near the main Mahadwar gate.
3. **Kiranotsav (Sun Ray Phenomenon):** Occurs twice a year (Jan 31 - Feb 2 and Nov 9 - Nov 12) when the setting sun rays touch the feet, chest, and face of the idol!
4. **Nearby:** Step right into **Bhavani Mandap** just 200 meters away after darshan.`
      };
    }

    if (q.includes('fort') || q.includes('panhala') || q.includes('history') || q.includes('maratha')) {
      return {
        success: true,
        source: "Kolhapur Expert Assistant",
        reply: `### ⚔️ Exploring Panhala Fort & Maratha History

**Panhala Fort Highlights (20 km from Kolhapur):**
- **Sajja Kothi:** The double-storied pavilion offering dramatic 360-degree vistas where Sambhaji Maharaj resided.
- **Ambarkhana:** The central three-building granary (Ganga, Yamuna, Saraswati) capable of storing 25,000 khandis of grain during sieges.
- **Teen Darwaja:** An architectural masterpiece with double gates, hidden soldier chambers, and defensive traps.
- **Shiva Kashid Statue:** Monument to the heroic barber who impersonated Chhatrapati Shivaji Maharaj to facilitate his legendary escape to Vishalgad.

*Best Time to Visit: Early mornings or late afternoons. Entry is free.*`
      };
    }

    if (q.includes('chappal') || q.includes('shopping') || q.includes('saaj') || q.includes('jaggery')) {
      return {
        success: true,
        source: "Kolhapur Expert Assistant",
        reply: `### 🛍️ Authentic Kolhapuri Crafts & Shopping Guide

**1. GI-Tagged Kolhapuri Chappals:**
- **Where to Buy:** Mahadwar Road, Bhausinghji Road, and Shivaji Market.
- **How to Identify Genuine Leather:** Look for vegetable-tanned soles (tanned using babool bark), hand-braided leather threads without iron nails, and the GI certification stamp.
- **Price Range:** ₹800 to ₹3,500 depending on intricate braid density.

**2. Kolhapuri Saaj Jewelry:**
- Traditional gold necklace featuring 21 auspicious symbols (leaves, flowers, weapons of deities).
- Visit the historic **Gujari Gold Market** near Ambabai Temple.

**3. Organic Kolhapuri Jaggery (Gul):**
- Kolhapur is India's largest jaggery market. Buy fresh golden jaggery blocks at the Shahu Market Yard.`
      };
    }

    // Default friendly assistant response
    return {
      success: true,
      source: "Kolhapur Expert Assistant",
      reply: `नमस्कार! Welcome to the Kolhapur Tourism Discovery & Travel Planning Assistant!

I can help you with:
- 🛕 **Temples & Timings:** Mahalakshmi (Ambabai) Temple, Jyotiba, Kopeshwar, Narsobawadi.
- 🏰 **Forts & Palaces:** Panhala Fort, New Palace Museum, Bhavani Mandap, Shalini Palace.
- 🍛 **Culinary Trails:** Authentic Misal spots, Tambda & Pandhra Rassa, Kolhapuri Bhel.
- 🛍️ **Artisanal Shopping:** GI-tagged Kolhapuri Chappals on Mahadwar Road, Kolhapuri Saaj jewelry.
- 🌿 **Nature Escapes:** Rankala Lake boating, Radhanagari Bison Sanctuary, Rautwadi Waterfalls.
- 🗺️ **Custom Itineraries:** Personalized 1 to 5-day tour plans.

How can I help you plan your Kolhapur journey today?`
    };
  }
}

module.exports = new AIService();
