window.ROAD_TRIP = {
  appId: "northwest-road-trip-2026",
  version: "0.2.0",
  buildDate: "2026-07-26",
  startDateTime: "2026-07-30T18:00:00-06:00",
  title: "Northwest Family Road Trip",
  subtitle: "Mountains, music, rides, shopping, and the long way home",
  startDate: "2026-07-30",
  endDate: "2026-08-08",
  home: "Berwyn, AB",
  travelers: "Family of four - two adults and girls aged 13 and 10",
  stats: [
    { value: "10", label: "days" },
    { value: "9", label: "nights" },
    { value: "5", label: "states and provinces" },
    { value: "1", label: "concert" }
  ],
  routeOverview: [
    { id: "edmonton", name: "Edmonton", region: "AB", lat: 53.5461, lon: -113.4938, type: "start" },
    { id: "lethbridge", name: "Lethbridge", region: "AB", lat: 49.6956, lon: -112.8451, type: "overnight" },
    { id: "glacier", name: "Glacier NP", region: "MT", lat: 48.6967, lon: -113.7183, type: "highlight" },
    { id: "missoula", name: "Missoula", region: "MT", lat: 46.8721, lon: -113.9940, type: "overnight" },
    { id: "silverwood", name: "Silverwood", region: "ID", lat: 47.9088, lon: -116.5960, type: "highlight" },
    { id: "coeurdalene", name: "Coeur d'Alene", region: "ID", lat: 47.6777, lon: -116.7805, type: "highlight" },
    { id: "spokanevalley", name: "Spokane Valley", region: "WA", lat: 47.6732, lon: -117.2394, type: "overnight" },
    { id: "sandpoint", name: "Sandpoint", region: "ID", lat: 48.2766, lon: -116.5535, type: "overnight" },
    { id: "nelson", name: "Nelson", region: "BC", lat: 49.4928, lon: -117.2948, type: "overnight" },
    { id: "penticton", name: "Penticton", region: "BC", lat: 49.4991, lon: -119.5937, type: "overnight" },
    { id: "clearwater", name: "Clearwater", region: "BC", lat: 51.6505, lon: -120.0350, type: "overnight" },
    { id: "hinton", name: "Hinton", region: "AB", lat: 53.4001, lon: -117.5857, type: "overnight" },
    { id: "berwyn", name: "Berwyn", region: "AB", lat: 56.1457, lon: -117.7364, type: "home" }
  ],
  reservations: {
    "day-1": {
      name: "Holiday Inn Express Lethbridge Southeast",
      address: "217 41st Street South, Lethbridge, AB, T1J 1Z3, Canada",
      confirmation: "",
      website: "https://www.hiexpress.com/lethbridgese",
      phone: "",
      checkin: "",
      checkout: "",
      notes: "Confirmed for July 30-31, 2026."
    }
  },
  days: [
    {
      id: "day-1",
      date: "2026-07-30",
      shortDate: "Jul 30",
      title: "Edmonton to Lethbridge",
      start: "Edmonton, AB",
      end: "Lethbridge, AB",
      overnight: "Lethbridge, AB",
      distanceKm: 510,
      driveTime: "about 5 hr 15 min",
      departure: "6:00 PM",
      arrival: "about 11:15 PM",
      tone: "travel",
      summary: "Finish the appointments, point the car south, and keep the first night simple.",
      timeZoneNote: "Mountain Time all day.",
      stops: ["Edmonton, AB", "Lethbridge, AB"],
      timeline: [
        { time: "6:00 PM", title: "Leave Edmonton", detail: "Fuel up before leaving the city and plan one quick supper or stretch stop." },
        { time: "8:30 PM", title: "Break near Red Deer or Calgary", detail: "Keep it short so the hotel arrival does not drift too late." },
        { time: "11:15 PM", title: "Arrive in Lethbridge", detail: "Check in, charge devices, and lay out passports and Glacier gear for the early start." }
      ],
      mustDo: [
        "Start with a full tank.",
        "Put passports and concert tickets in the travel bag, not the luggage.",
        "Set alarms before going to sleep."
      ],
      optional: ["Pick up breakfast supplies for the early Glacier morning."],
      alerts: ["This is a functional overnight. Choose easy highway access and reliable late check-in over a scenic location."],
      hotelHint: "South Lethbridge or near Highway 4/5 makes the morning departure easier."
    },
    {
      id: "day-2",
      date: "2026-07-31",
      shortDate: "Jul 31",
      title: "Glacier National Park to Missoula",
      start: "Lethbridge, AB",
      end: "Missoula, MT",
      overnight: "Missoula, MT",
      distanceKm: 500,
      driveTime: "about 7.5 hr driving, plus border and park stops",
      departure: "about 5:40 AM",
      arrival: "evening",
      tone: "mountains",
      summary: "Cross at Carway/Piegan, enter Glacier from the east, and drive Going-to-the-Sun Road east to west.",
      timeZoneNote: "Alberta and Montana are both on Mountain Time.",
      stops: [
        "Lethbridge, AB",
        "Carway Border Crossing, AB",
        "St. Mary Visitor Center, Glacier National Park",
        "Logan Pass Visitor Center, Glacier National Park",
        "Lake McDonald Lodge, Glacier National Park",
        "Missoula, MT"
      ],
      timeline: [
        { time: "5:40 AM", title: "Leave Lethbridge", detail: "Aim to reach the Carway/Piegan crossing close to its 7:00 AM opening." },
        { time: "Morning", title: "St. Mary and east entrance", detail: "Restrooms, park pass, road-status check, and a quick look at St. Mary Lake." },
        { time: "Late morning", title: "Going-to-the-Sun Road", detail: "Use designated pullouts only. Logan Pass parking is time-limited in 2026 and may be full." },
        { time: "Afternoon", title: "Lake McDonald", detail: "Stop at the lodge or shoreline, then continue toward Missoula." },
        { time: "Evening", title: "Arrive in Missoula", detail: "Check in for two nights and keep the evening easy." }
      ],
      mustDo: [
        "Check the official Glacier road and weather page before leaving Lethbridge.",
        "Carry layers; Logan Pass can be much colder and windier than the valleys.",
        "Have the park pass ready before reaching the entrance station.",
        "Allow flexibility for congestion and wildlife delays."
      ],
      optional: [
        "Short shoreline stop at Wild Goose Island Overlook.",
        "Hidden Lake Overlook only if parking, trail conditions, energy, and time all cooperate."
      ],
      alerts: [
        "As of the latest 2026 guidance, no vehicle reservation is required, but Logan Pass parking is limited to three hours.",
        "Do not let a long park stop turn the Missoula arrival into a very late night."
      ],
      hotelHint: "A hotel with parking and either downtown access or a simple route to the university will be useful for the concert stay."
    },
    {
      id: "day-3",
      date: "2026-08-01",
      shortDate: "Aug 1",
      title: "Missoula concert day",
      start: "Missoula, MT",
      end: "Missoula, MT",
      overnight: "Missoula, MT",
      distanceKm: 0,
      driveTime: "local travel only",
      departure: "unhurried morning",
      arrival: "same hotel",
      tone: "music",
      summary: "A low-mileage day built around Luke Bryan and Jason Aldean at Washington-Grizzly Stadium.",
      timeZoneNote: "Mountain Time.",
      stops: ["Missoula, MT", "Washington-Grizzly Stadium, Missoula, MT"],
      timeline: [
        { time: "Morning", title: "Sleep in and reset", detail: "Breakfast, a walk by the Clark Fork River, and no ambitious driving." },
        { time: "Afternoon", title: "Concert preparation", detail: "Confirm gates, bag policy, ticket access, transportation, and weather before leaving the hotel." },
        { time: "Evening", title: "Double Down Tour 2026", detail: "Luke Bryan and Jason Aldean at Washington-Grizzly Stadium." },
        { time: "After show", title: "Return to the same hotel", detail: "Do not plan a highway departure after the stadium empties." }
      ],
      mustDo: [
        "Screenshot or download tickets before entering the stadium area.",
        "Check the current concert FAQ and transportation plan.",
        "Bring hearing protection for anyone who wants it.",
        "Agree on a family meeting point in case cell service is congested."
      ],
      optional: ["Downtown Missoula, riverfront trail, or Carousel for Missoula before the concert."],
      alerts: ["Large-event traffic and cell congestion are likely. Walking or an event shuttle may be easier than stadium-adjacent parking."],
      hotelHint: "Second night at the same Missoula hotel."
    },
    {
      id: "day-4",
      date: "2026-08-02",
      shortDate: "Aug 2",
      title: "Silverwood to Spokane Valley",
      start: "Missoula, MT",
      end: "Spokane Valley, WA",
      overnight: "Spokane Valley, WA",
      distanceKm: 380,
      driveTime: "about 4 hr total, plus the park day",
      departure: "around 8:00 AM MDT",
      arrival: "after park close",
      tone: "rides",
      summary: "Gain an hour crossing into Pacific Time, spend the day at Silverwood and Boulder Beach, then continue to the Spokane Valley hotel.",
      timeZoneNote: "You gain one hour travelling from Montana to northern Idaho. Silverwood uses Pacific Time.",
      stops: ["Missoula, MT", "Silverwood Theme Park, Athol, ID", "Spokane Valley, WA"],
      timeline: [
        { time: "8:00 AM MDT", title: "Leave Missoula", detail: "The clock moves back one hour en route, helping with the 11:00 AM PDT park opening." },
        { time: "11:00 AM PDT", title: "Silverwood opens", detail: "Boulder Beach is scheduled for 11:00 AM to 7:00 PM; the theme park is scheduled to 9:00 PM." },
        { time: "Afternoon", title: "Water park and rides", detail: "Choose a family meeting point and use a locker for dry clothes and valuables." },
        { time: "After close", title: "Drive to Spokane Valley", detail: "Continue past Coeur d'Alene to the Spokane Valley hotel and call it a night." }
      ],
      mustDo: [
        "Pack swimwear, towels, sunscreen, water shoes, and dry clothes in one easy-to-carry park bag.",
        "Confirm park hours the night before because operating schedules can change.",
        "Measure or review ride restrictions before queueing.",
        "Set a meeting point and check-in times for independent ride choices."
      ],
      optional: ["Stop briefly in Coeur d'Alene only if everyone still has energy; the hotel is farther west in Spokane Valley."],
      alerts: ["The long park day follows the concert. The Spokane Valley hotel adds driving after the park, but puts the family beside the next day's shopping."],
      hotelHint: "Spokane Valley near I-90 and the shopping district; prioritize easy late arrival and parking."
    },
    {
      id: "day-5",
      date: "2026-08-03",
      shortDate: "Aug 3",
      title: "Spokane Valley shopping to Sandpoint",
      start: "Spokane Valley, WA",
      end: "Sandpoint, ID",
      overnight: "Sandpoint, ID",
      distanceKm: 135,
      driveTime: "about 1 hr 45 min driving, plus shopping",
      departure: "morning",
      arrival: "late afternoon or evening",
      tone: "shopping",
      summary: "Start beside the shopping district, work through the Spokane Valley list, then turn north for Sandpoint.",
      timeZoneNote: "Pacific Time all day.",
      stops: [
        "Spokane Valley, WA",
        "Spokane Valley Mall, Spokane Valley, WA",
        "Sandpoint, ID"
      ],
      timeline: [
        { time: "Morning", title: "Breakfast in Spokane Valley", detail: "Start close to the shopping district with no backtracking from Coeur d'Alene." },
        { time: "Late morning", title: "Spokane Valley Mall", detail: "Victoria's Secret and PINK is the required stop. The mall also groups several teen-friendly stores together." },
        { time: "Afternoon", title: "Big-box loop", detail: "Use the shopping checklist to decide which stores deserve time and which can be skipped." },
        { time: "Late afternoon", title: "Drive north to Sandpoint", detail: "Check in and walk City Beach or downtown if the weather cooperates." }
      ],
      mustDo: [
        "Victoria's Secret and PINK at Spokane Valley Mall.",
        "Keep receipts together for the Canadian border declaration.",
        "Leave room in the vehicle before beginning the shopping loop."
      ],
      optional: [
        "Target, Walmart, Costco, Ulta Beauty, Best Buy, TJ Maxx, or REI depending on the family's priorities.",
        "Trader Joe's is possible but is not in the tight Spokane Valley mall cluster, so treat it as an optional detour."
      ],
      alerts: ["Shopping time expands easily. Set a target departure for Sandpoint so the lake-town evening is not lost."],
      hotelHint: "Downtown or near City Beach is ideal if the price works; otherwise prioritize parking and breakfast."
    },
    {
      id: "day-6",
      date: "2026-08-04",
      shortDate: "Aug 4",
      title: "Sandpoint to Nelson",
      start: "Sandpoint, ID",
      end: "Nelson, BC",
      overnight: "Nelson, BC",
      distanceKm: 270,
      driveTime: "about 4 hr 15 min driving, plus border, ferry wait, and crossing",
      departure: "late morning",
      arrival: "mid-afternoon",
      tone: "lakes",
      summary: "Follow the International Selkirk Loop through Creston and Crawford Bay, then ride the free Kootenay Lake Ferry to Balfour before Nelson.",
      timeZoneNote: "Pacific Time on both sides of this border crossing.",
      stops: [
        "Sandpoint, ID",
        "Porthill-Rykerts Border Crossing",
        "Creston, BC",
        "Crawford Bay, BC",
        "Kootenay Bay Ferry Terminal, BC",
        "Balfour Ferry Terminal, BC",
        "Nelson, BC"
      ],
      timeline: [
        { time: "Morning", title: "Breakfast and a little downtown Sandpoint", detail: "Keep this easy: coffee, a few shops if desired, then leave the beach behind." },
        { time: "Late morning", title: "Drive toward Porthill", detail: "Fuel before the border and make sure all shopping receipts are accessible." },
        { time: "Early afternoon", title: "Cross into Canada", detail: "Declare purchases accurately and expect the schedule to flex with the border wait." },
        { time: "Afternoon", title: "Crawford Bay artisans", detail: "Browse the compact artisan cluster only if it appeals; it is an easy shopping-friendly stop before the ferry." },
        { time: "Afternoon", title: "Kootenay Lake Ferry", detail: "Queue at Kootenay Bay for the free 35-minute crossing to Balfour. Build in summer wait time." },
        { time: "Late afternoon", title: "Arrive in Nelson", detail: "Check in, then browse Baker Street and choose dinner downtown." }
      ],
      mustDo: [
        "Organize passports and receipts before reaching the border.",
        "Fill the tank before the rural portion of the drive.",
        "Check the official ferry and DriveBC status before leaving Creston.",
        "Leave enough daylight to enjoy Nelson rather than treating it only as a sleep stop."
      ],
      optional: ["Creston fruit stand or a short local-food stop.", "Crawford Bay artisan shops before the ferry."],
      alerts: ["Border processing and ferry queue time are not included in the driving estimate.", "Use a daytime crossing. Recheck Porthill/Rykerts hours before August 4.", "The Kootenay Lake ferry is free and the crossing is about 35 minutes, but summer lineups can add time."],
      hotelHint: "Downtown Nelson is worth prioritizing because the evening becomes walkable once the car is parked."
    },
    {
      id: "day-7",
      date: "2026-08-05",
      shortDate: "Aug 5",
      title: "Nelson to Penticton",
      start: "Nelson, BC",
      end: "Penticton, BC",
      overnight: "Penticton, BC",
      distanceKm: 325,
      driveTime: "about 5 hr, before stops",
      departure: "morning",
      arrival: "mid- to late afternoon",
      tone: "okanagan",
      summary: "Follow Highway 3 through Castlegar, Grand Forks, Greenwood, Osoyoos, and Oliver to meet your friend in Penticton.",
      timeZoneNote: "Pacific Time all day.",
      stops: ["Nelson, BC", "Grand Forks, BC", "Greenwood, BC", "Osoyoos, BC", "Penticton, BC"],
      timeline: [
        { time: "Morning", title: "Leave Nelson", detail: "This is a scenic two-lane highway day, not a freeway sprint." },
        { time: "Midday", title: "Boundary Country", detail: "Choose one sensible meal or stretch stop in Grand Forks or Greenwood." },
        { time: "Afternoon", title: "Osoyoos and Oliver", detail: "Fruit stands or a short lake viewpoint are easy additions if the Penticton meetup time allows." },
        { time: "Late afternoon", title: "Meet up in Penticton", detail: "Protect the social time by not overloading the route with stops." }
      ],
      mustDo: [
        "Confirm the Penticton meetup time before leaving Nelson.",
        "Carry water and snacks for the Highway 3 drive.",
        "Choose only one or two route stops so Penticton remains the focus."
      ],
      optional: ["Greenwood walk, Osoyoos lake view, or an orchard stop."],
      alerts: ["The earlier estimate for this leg was too short. Plan on roughly 325 km and about five hours of wheel time before sightseeing."],
      hotelHint: "Near Okanagan Lake or downtown is convenient for the meetup and an evening waterfront walk."
    },
    {
      id: "day-8",
      date: "2026-08-06",
      shortDate: "Aug 6",
      title: "Penticton to Clearwater",
      start: "Penticton, BC",
      end: "Clearwater, BC",
      overnight: "Clearwater, BC",
      distanceKm: 365,
      driveTime: "about 4.5 hr before stops",
      departure: "late morning",
      arrival: "late afternoon",
      tone: "waterfalls",
      summary: "Leave the Okanagan, pass through the Thompson corridor, and settle in at the gateway to Wells Gray Provincial Park.",
      timeZoneNote: "Pacific Time all day.",
      stops: ["Penticton, BC", "Kamloops, BC", "Clearwater, BC"],
      timeline: [
        { time: "Morning", title: "Penticton time", detail: "Breakfast, beach, or more time with your friend before leaving." },
        { time: "Midday", title: "Drive north", detail: "Use Kamloops for fuel, supplies, or lunch if needed." },
        { time: "Late afternoon", title: "Arrive in Clearwater", detail: "Check in before deciding whether there is energy for a nearby viewpoint." }
      ],
      mustDo: [
        "Fuel and buy snacks before leaving the larger centres.",
        "Decide whether Wells Gray sightseeing belongs this evening or the next morning.",
        "Keep the evening flexible after several active days."
      ],
      optional: ["Spahats Falls if daylight and energy remain."],
      alerts: ["Waterfall access adds distance and time beyond the town-to-town estimate."],
      hotelHint: "A comfortable Clearwater motel or lodge with breakfast and simple parking is the goal."
    },
    {
      id: "day-9",
      date: "2026-08-07",
      shortDate: "Aug 7",
      title: "Clearwater to Hinton",
      start: "Clearwater, BC",
      end: "Hinton, AB",
      overnight: "Hinton, AB",
      distanceKm: 398,
      driveTime: "about 4 hr 30 min before stops",
      departure: "morning",
      arrival: "late afternoon",
      tone: "rockies",
      summary: "Choose one Wells Gray highlight, then travel through Valemount, Mount Robson country, Jasper, and the Yellowhead to Hinton.",
      timeZoneNote: "You lose one hour when entering Alberta and Mountain Time.",
      stops: [
        "Clearwater, BC",
        "Helmcken Falls, Wells Gray Provincial Park",
        "Valemount, BC",
        "Mount Robson Visitor Centre, BC",
        "Jasper, AB",
        "Hinton, AB"
      ],
      timeline: [
        { time: "Morning", title: "Helmcken Falls", detail: "The viewpoint is the signature Wells Gray stop, but the park access road adds meaningful time." },
        { time: "Late morning", title: "Return to Highway 5", detail: "Fuel in Clearwater or Valemount before the mountain corridor." },
        { time: "Afternoon", title: "Mount Robson and Jasper route", detail: "Use short viewpoints rather than turning the day into another full park itinerary." },
        { time: "Late afternoon", title: "Arrive in Hinton", detail: "Final hotel night, repack the vehicle, and prepare for the direct run home." }
      ],
      mustDo: [
        "Account for the one-hour time-zone loss.",
        "Check Highway 5 and Highway 16 conditions before departure.",
        "Keep wildlife distance and never stop in an active traffic lane for a sighting."
      ],
      optional: ["Mount Robson viewpoint or a brief Jasper stop, depending on the day's pace."],
      alerts: ["Helmcken Falls is not a five-minute detour from the highway; allow time for the access road in both directions."],
      hotelHint: "A reliable chain hotel with breakfast and easy Highway 16 access is ideal for the final night."
    },
    {
      id: "day-10",
      date: "2026-08-08",
      shortDate: "Aug 8",
      title: "Hinton to Berwyn",
      start: "Hinton, AB",
      end: "Berwyn, AB",
      overnight: "Home",
      distanceKm: 470,
      driveTime: "about 5 hr",
      departure: "morning",
      arrival: "afternoon",
      tone: "home",
      summary: "A straightforward final run through Grande Prairie and home to Berwyn before the Saturday deadline.",
      timeZoneNote: "Mountain Time all day.",
      stops: ["Hinton, AB", "Grande Prairie, AB", "Berwyn, AB"],
      timeline: [
        { time: "Morning", title: "Leave Hinton", detail: "Start with a full tank and a simple breakfast." },
        { time: "Midday", title: "Grande Prairie break", detail: "Fuel, lunch, and any last supplies." },
        { time: "Afternoon", title: "Arrive home in Berwyn", detail: "Unload only the essentials and leave the full trip reset for the next day." }
      ],
      mustDo: ["Confirm the final-day weather and road conditions.", "Keep the Saturday arrival buffer rather than adding a major detour."],
      optional: ["One relaxed lunch stop in Grande Prairie."],
      alerts: ["The goal is home no later than Saturday, August 8. Protect the buffer."],
      hotelHint: "No hotel - home night."
    }
  ],
  shopping: [
    {
      category: "Required",
      items: [
        { id: "vs", name: "Victoria's Secret and PINK", detail: "Spokane Valley Mall, 14700 E Indiana Ave, Space 1146", query: "Victoria's Secret Spokane Valley Mall" }
      ]
    },
    {
      category: "Big-box priorities",
      items: [
        { id: "target", name: "Target", detail: "Choose the Spokane Valley location that best fits the loop", query: "Target Spokane Valley WA" },
        { id: "walmart", name: "Walmart Supercenter", detail: "Groceries, road supplies, and general shopping", query: "Walmart Supercenter Spokane Valley WA" },
        { id: "costco", name: "Costco", detail: "Only worthwhile if the family has a focused list", query: "Costco Spokane Valley WA" },
        { id: "bestbuy", name: "Best Buy", detail: "Electronics and travel accessories", query: "Best Buy Spokane Valley WA" },
        { id: "tjmaxx", name: "TJ Maxx or Marshalls", detail: "Discount clothing and home goods", query: "TJ Maxx Spokane Valley WA" }
      ]
    },
    {
      category: "Girls' stores",
      items: [
        { id: "ulta", name: "Ulta Beauty", detail: "Beauty and skin care", query: "Ulta Beauty Spokane Valley WA" },
        { id: "bathbody", name: "Bath and Body Works", detail: "Inside Spokane Valley Mall", query: "Bath and Body Works Spokane Valley Mall" },
        { id: "sephora", name: "Sephora", detail: "Inside Spokane Valley Mall", query: "Sephora Spokane Valley Mall" },
        { id: "hm", name: "H and M", detail: "Inside Spokane Valley Mall", query: "H and M Spokane Valley Mall" }
      ]
    },
    {
      category: "Optional detours",
      items: [
        { id: "traderjoes", name: "Trader Joe's", detail: "Not in the tight mall cluster; add only if it matters", query: "Trader Joe's Spokane WA" },
        { id: "rei", name: "REI", detail: "Outdoor gear; likely a Spokane detour", query: "REI Spokane WA" },
        { id: "cabelas", name: "Cabela's", detail: "Post Falls, Idaho, convenient on the I-90 corridor", query: "Cabela's Post Falls ID" }
      ]
    }
  ],
  packing: [
    {
      category: "Documents and money",
      items: [
        { id: "passports", name: "Passports for all four travellers" },
        { id: "concert-tickets", name: "Concert tickets downloaded or screenshotted" },
        { id: "silverwood-tickets", name: "Silverwood tickets or purchase plan" },
        { id: "insurance", name: "Travel medical insurance details" },
        { id: "vehicle-docs", name: "Registration, insurance, roadside assistance" },
        { id: "cards-cash", name: "Credit cards and some US cash" },
        { id: "receipts-envelope", name: "Envelope or pouch for US shopping receipts" }
      ]
    },
    {
      category: "Glacier and outdoors",
      items: [
        { id: "layers", name: "Warm layers and light rain shells" },
        { id: "shoes", name: "Comfortable walking shoes" },
        { id: "sunscreen", name: "Sunscreen and lip balm" },
        { id: "water", name: "Refillable water bottles" },
        { id: "binoculars", name: "Binoculars" },
        { id: "daypack", name: "Small daypack" },
        { id: "cooler", name: "Small cooler and road snacks" }
      ]
    },
    {
      category: "Concert",
      items: [
        { id: "hearing", name: "Hearing protection" },
        { id: "stadium-bag", name: "Venue-compliant bag" },
        { id: "portable-battery", name: "Charged power bank and cables" },
        { id: "meeting-point", name: "Family meeting point agreed in advance" }
      ]
    },
    {
      category: "Silverwood and swimming",
      items: [
        { id: "swimsuits", name: "Swimsuits" },
        { id: "towels", name: "Quick-dry towels" },
        { id: "water-shoes", name: "Water shoes or secure sandals" },
        { id: "dry-clothes", name: "Dry change of clothes in one park bag" },
        { id: "locker-plan", name: "Locker plan and waterproof phone pouch" }
      ]
    },
    {
      category: "Road comfort",
      items: [
        { id: "offline-maps", name: "Offline Google Maps areas downloaded" },
        { id: "chargers", name: "Car chargers and spare cables" },
        { id: "medications", name: "Medications and basic first-aid kit" },
        { id: "laundry", name: "Laundry bag and small detergent supply" },
        { id: "pillows", name: "Road pillows or light blankets" },
        { id: "entertainment", name: "Audiobooks, playlists, and downloads" }
      ]
    }
  ],
  borderChecklist: [
    { id: "border-passports", name: "Passports are accessible from the front seat" },
    { id: "border-purpose", name: "Trip purpose and overnight plan are easy to explain" },
    { id: "border-food", name: "Food and agricultural items reviewed before each crossing" },
    { id: "border-receipts", name: "Receipts and purchase totals are organized for return to Canada" },
    { id: "border-restrictions", name: "Current customs and border notices checked" }
  ],
  reminders: [
    { id: "book-hotels", text: "Enter each hotel and confirmation number in the Stays section." },
    { id: "download-maps", text: "Download offline map areas before leaving reliable service." },
    { id: "park-status", text: "Recheck Glacier road, trail, weather, and wildfire conditions on July 30." },
    { id: "concert-faq", text: "Recheck concert gates, bag policy, parking, and shuttle information." },
    { id: "silverwood-hours", text: "Reconfirm Silverwood and Boulder Beach hours before August 2." },
    { id: "porthill-hours", text: "Recheck both Porthill and Rykerts border hours before the August 4 crossing." },
    { id: "share-backup", text: "Export a trip backup after hotels and confirmations are entered." }
  ],
  liveChecks: [
    {
      id: "glacier-conditions",
      title: "Glacier current conditions",
      note: "Road, weather, trail, and park alerts. Going-to-the-Sun Road was fully open when this app was built.",
      url: "https://www.nps.gov/glac/planyourvisit/conditions.htm",
      verified: "July 25, 2026"
    },
    {
      id: "glacier-2026",
      title: "Glacier 2026 access changes",
      note: "No vehicle reservation is required in 2026; Logan Pass parking is time-limited and shuttles require reservations.",
      url: "https://www.nps.gov/glac/planyourvisit/vehicle-reservations2026.htm",
      verified: "July 25, 2026"
    },
    {
      id: "piegan-border",
      title: "Piegan port of entry",
      note: "Official CBP contact and operating hours. The published daily hours were 7:00 AM to 11:00 PM Mountain Time when checked.",
      url: "https://www.cbp.gov/contact/ports/piegan-mt",
      verified: "July 25, 2026"
    },
    {
      id: "porthill-border",
      title: "Porthill U.S. port listing",
      note: "Official U.S. port page. It listed daily hours of 7:00 AM to 7:00 PM Pacific when checked; plan to cross well before evening.",
      url: "https://www.cbp.gov/about/contact/ports/porthill-id-idaho-3308",
      verified: "July 25, 2026"
    },
    {
      id: "rykerts-border",
      title: "Rykerts Canadian port listing",
      note: "Official Canadian port page. It listed summer traveller hours of 7:00 AM to 11:00 PM Pacific when checked. Reconfirm because the paired U.S. listing showed an earlier close.",
      url: "https://do-rb.cbsa-asfc.cloud-nuage.canada.ca/?id=545&lang=en_CA",
      verified: "July 25, 2026"
    },
    {
      id: "concert",
      title: "Official GrizTix concert page",
      note: "Luke Bryan and Jason Aldean, Saturday, August 1, 2026, at Washington-Grizzly Stadium.",
      url: "https://www.umt.edu/griztix/",
      verified: "July 25, 2026"
    },
    {
      id: "silverwood-hours",
      title: "Silverwood 2026 calendar",
      note: "August 2 was listed as Silverwood 11:00 AM to 9:00 PM and Boulder Beach 11:00 AM to 7:00 PM when checked.",
      url: "https://www.silverwoodthemepark.com/park/park-hours.php?Month=8&Year=2026",
      verified: "July 25, 2026"
    },
    {
      id: "vs-store",
      title: "Victoria's Secret Spokane Valley",
      note: "Official store page for the Spokane Valley Mall location.",
      url: "https://stores.victoriassecret.com/us/wa/spokanevalley/lingerie-736.html",
      verified: "July 25, 2026"
    },
    {
      id: "drivebc",
      title: "DriveBC",
      note: "BC highway incidents, closures, construction, and webcams.",
      url: "https://www.drivebc.ca/",
      verified: "Use live"
    },
    {
      id: "511-alberta",
      title: "511 Alberta",
      note: "Alberta road reports and closures for the first and final legs.",
      url: "https://511.alberta.ca/",
      verified: "Use live"
    },
    {
      id: "montana-511",
      title: "Montana 511",
      note: "Montana road conditions, incidents, and construction.",
      url: "https://www.511mt.net/",
      verified: "Use live"
    },
    {
      id: "idaho-511",
      title: "Idaho 511",
      note: "Idaho road conditions and construction.",
      url: "https://511.idaho.gov/",
      verified: "Use live"
    },
    {
      id: "washington-511",
      title: "Washington travel map",
      note: "Washington road conditions for the Spokane Valley shopping leg.",
      url: "https://wsdot.com/Travel/Real-time/Map/",
      verified: "Use live"
    }
  ]
};
