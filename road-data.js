window.BOBSX4_DATA = {
  "app": {
    "id": "bobsx4-road-companion",
    "name": "Bobsx4 Road Companion",
    "shortName": "Road Companion",
    "version": "0.3.0 RC1",
    "versionCode": "0.3.0-rc1",
    "buildDate": "2026-07-27",
    "dataSchema": 3,
    "tagline": "Adventure is where you are going. Road Companion is how you will remember it."
  },
  "defaultProfiles": [
    {
      "id": "navigator",
      "name": "Navigator",
      "experience": "navigator",
      "roleLabel": "Independent traveller",
      "initials": "N",
      "accent": "indigo"
    },
    {
      "id": "explorer",
      "name": "Explorer",
      "experience": "explorer",
      "roleLabel": "Visual explorer",
      "initials": "E",
      "accent": "teal"
    }
  ],
  "globalBadges": [
    {
      "id": "observer",
      "name": "Sharp Observer",
      "icon": "◎",
      "description": "Record 25 real sightings across the adventure.",
      "type": "sightings",
      "threshold": 25
    },
    {
      "id": "field-notes",
      "name": "Field Notes",
      "icon": "✎",
      "description": "Complete journal entries for three different days.",
      "type": "journals",
      "threshold": 3
    },
    {
      "id": "mission-control",
      "name": "Mission Control",
      "icon": "✓",
      "description": "Complete ten mission tasks.",
      "type": "missions",
      "threshold": 10
    },
    {
      "id": "critic",
      "name": "Road Critic",
      "icon": "★",
      "description": "Rate five travel days.",
      "type": "ratings",
      "threshold": 5
    }
  ],
  "adventures": [
    {
      "id": "northwest-adventure-2026",
      "title": "Northwest Adventure 2026",
      "shortTitle": "Northwest 2026",
      "theme": "mountains",
      "mission": "Cross borders, follow mountain roads, test Silverwood, ride the Kootenay Lake Ferry, meet unusual animals, and return home with stories worth keeping.",
      "startDateTime": "2026-07-30T18:00:00-06:00",
      "startDate": "2026-07-30",
      "endDate": "2026-08-08",
      "home": "Berwyn, AB",
      "subtitle": "Mountains, rides, shopping, ferries, and the long way home",
      "routeOverview": [
        {
          "id": "edmonton",
          "name": "Edmonton",
          "region": "AB",
          "lat": 53.5461,
          "lon": -113.4938,
          "type": "start"
        },
        {
          "id": "lethbridge",
          "name": "Lethbridge",
          "region": "AB",
          "lat": 49.6956,
          "lon": -112.8451,
          "type": "overnight"
        },
        {
          "id": "glacier",
          "name": "Glacier NP",
          "region": "MT",
          "lat": 48.6967,
          "lon": -113.7183,
          "type": "highlight"
        },
        {
          "id": "kalispell",
          "name": "Kalispell",
          "region": "MT",
          "lat": 48.192,
          "lon": -114.3168,
          "type": "overnight"
        },
        {
          "id": "silverwood",
          "name": "Silverwood",
          "region": "ID",
          "lat": 47.9088,
          "lon": -116.596,
          "type": "highlight"
        },
        {
          "id": "coeurdalene",
          "name": "Coeur d'Alene",
          "region": "ID",
          "lat": 47.6777,
          "lon": -116.7805,
          "type": "overnight"
        },
        {
          "id": "sandpoint",
          "name": "Sandpoint",
          "region": "ID",
          "lat": 48.2766,
          "lon": -116.5535,
          "type": "overnight"
        },
        {
          "id": "nelson",
          "name": "Nelson",
          "region": "BC",
          "lat": 49.4928,
          "lon": -117.2948,
          "type": "overnight"
        },
        {
          "id": "penticton",
          "name": "Penticton",
          "region": "BC",
          "lat": 49.4991,
          "lon": -119.5937,
          "type": "overnight"
        },
        {
          "id": "clearwater",
          "name": "Clearwater",
          "region": "BC",
          "lat": 51.6505,
          "lon": -120.035,
          "type": "overnight"
        },
        {
          "id": "hinton",
          "name": "Hinton",
          "region": "AB",
          "lat": 53.4001,
          "lon": -117.5857,
          "type": "overnight"
        },
        {
          "id": "berwyn",
          "name": "Berwyn",
          "region": "AB",
          "lat": 56.1457,
          "lon": -117.7364,
          "type": "home"
        }
      ],
      "reservations": {
        "day-1": {
          "name": "Holiday Inn Express Lethbridge Southeast",
          "address": "217 41st Street South, Lethbridge, AB, T1J 1Z3, Canada",
          "confirmation": "",
          "website": "https://www.hiexpress.com/lethbridgese",
          "phone": "",
          "checkin": "",
          "checkout": "",
          "notes": "Confirmed for July 30-31, 2026."
        }
      },
      "days": [
        {
          "id": "day-1",
          "date": "2026-07-30",
          "shortDate": "Jul 30",
          "title": "Edmonton to Lethbridge",
          "start": "Edmonton, AB",
          "end": "Lethbridge, AB",
          "overnight": "Lethbridge, AB",
          "distanceKm": 510,
          "driveTime": "about 5 hr 15 min",
          "departure": "6:00 PM",
          "arrival": "about 11:15 PM",
          "tone": "travel",
          "summary": "Finish the appointments, point the car south, and keep the first night simple.",
          "timeZoneNote": "Mountain Time all day.",
          "stops": [
            "Edmonton, AB",
            "Lethbridge, AB"
          ],
          "timeline": [
            {
              "time": "6:00 PM",
              "title": "Leave Edmonton",
              "detail": "Fuel up before leaving the city and plan one quick supper or stretch stop."
            },
            {
              "time": "8:30 PM",
              "title": "Break near Red Deer or Calgary",
              "detail": "Keep it short so the hotel arrival does not drift too late."
            },
            {
              "time": "11:15 PM",
              "title": "Arrive in Lethbridge",
              "detail": "Check in, charge devices, and lay out passports and Glacier gear for the early start."
            }
          ],
          "mustDo": [
            "Start with a full tank.",
            "Put passports and important travel documents in the travel bag, not the luggage.",
            "Set alarms before going to sleep."
          ],
          "optional": [
            "Pick up breakfast supplies for the early Glacier morning."
          ],
          "alerts": [
            "This is a functional overnight. Choose easy highway access and reliable late check-in over a scenic location."
          ],
          "hotelHint": "South Lethbridge or near Highway 4/5 makes the morning departure easier.",
          "adventure": {
            "briefing": {
              "explorer": "The adventure begins after a busy Edmonton day. Your mission is to watch the prairie change as the family heads south and help the first hotel stop go smoothly.",
              "navigator": "Launch night is about route discipline: leave on time, monitor the southbound corridor, and help the family arrive in Lethbridge ready for an early border-and-mountains morning."
            },
            "missions": [
              {
                "id": "launch-song",
                "label": "Choose the first official road-trip song",
                "audience": "all"
              },
              {
                "id": "arrival-guess",
                "label": "Predict the hotel arrival time before leaving Edmonton",
                "audience": "navigator"
              },
              {
                "id": "hotel-ready",
                "label": "Help set out passports, chargers, and morning layers at the hotel",
                "audience": "all"
              },
              {
                "id": "route-check",
                "label": "Find Lethbridge on the route map without searching by name",
                "audience": "explorer"
              }
            ],
            "spotting": [
              {
                "id": "grain-elevator",
                "label": "Grain elevator",
                "icon": "▥",
                "target": 2
              },
              {
                "id": "train",
                "label": "Freight train",
                "icon": "↔",
                "target": 2
              },
              {
                "id": "wind-turbine",
                "label": "Wind turbine",
                "icon": "✦",
                "target": 5
              },
              {
                "id": "red-barn",
                "label": "Red barn",
                "icon": "⌂",
                "target": 3
              },
              {
                "id": "sunset",
                "label": "Great sunset view",
                "icon": "◐",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "Prairie transition",
                "text": "The drive south crosses broad agricultural country before the landscape drops toward the Oldman River valley near Lethbridge.",
                "prompt": "Watch for the point where the land stops feeling flat."
              }
            ],
            "photoMission": {
              "explorer": "Capture the best sunset colour from the passenger seat.",
              "navigator": "Take one image that shows the transition from city travel to open-road travel."
            },
            "badge": {
              "id": "launch-crew",
              "name": "Launch Crew",
              "icon": "↗",
              "description": "Started the Northwest Adventure prepared and on schedule."
            },
            "teaser": {
              "title": "Tomorrow: border to alpine country",
              "text": "An early border crossing leads to Going-to-the-Sun Road, Logan Pass, and the first mountain overnight in Kalispell."
            }
          }
        },
        {
          "id": "day-2",
          "date": "2026-07-31",
          "shortDate": "Jul 31",
          "title": "Glacier National Park to Kalispell",
          "start": "Lethbridge, AB",
          "end": "Kalispell, MT",
          "overnight": "Kalispell, MT",
          "distanceKm": 300,
          "driveTime": "about 5 hr driving, plus border and park stops",
          "departure": "about 5:40 AM",
          "arrival": "late afternoon or evening",
          "tone": "mountains",
          "summary": "Cross at Carway/Piegan, drive Going-to-the-Sun Road east to west, and finish the day in Kalispell.",
          "timeZoneNote": "Alberta and Montana are both on Mountain Time.",
          "stops": [
            "Lethbridge, AB",
            "Carway Border Crossing, AB",
            "St. Mary Visitor Center, Glacier National Park",
            "Logan Pass Visitor Center, Glacier National Park",
            "Lake McDonald Lodge, Glacier National Park",
            "Kalispell, MT"
          ],
          "timeline": [
            {
              "time": "5:40 AM",
              "title": "Leave Lethbridge",
              "detail": "Aim to reach the Carway/Piegan crossing close to its 7:00 AM opening."
            },
            {
              "time": "Morning",
              "title": "St. Mary and east entrance",
              "detail": "Restrooms, park pass, road-status check, and a quick look at St. Mary Lake."
            },
            {
              "time": "Late morning",
              "title": "Going-to-the-Sun Road",
              "detail": "Use designated pullouts only. Logan Pass parking is time-limited in 2026 and may be full."
            },
            {
              "time": "Afternoon",
              "title": "Lake McDonald",
              "detail": "Stop at the lodge or shoreline, then continue to Kalispell."
            },
            {
              "time": "Evening",
              "title": "Arrive in Kalispell",
              "detail": "Check in for one night and keep the evening flexible."
            }
          ],
          "mustDo": [
            "Check the official Glacier road and weather page before leaving Lethbridge.",
            "Carry layers; Logan Pass can be much colder and windier than the valleys.",
            "Have the park pass ready before reaching the entrance station.",
            "Allow flexibility for congestion and wildlife delays."
          ],
          "optional": [
            "Short shoreline stop at Wild Goose Island Overlook.",
            "Hidden Lake Overlook only if parking, trail conditions, energy, and time all cooperate."
          ],
          "alerts": [
            "As of the latest 2026 guidance, no vehicle reservation is required, but Logan Pass parking is limited to three hours.",
            "Kalispell is the confirmed overnight for July 31."
          ],
          "hotelHint": "Kalispell for the night of July 31; prioritize easy parking and a simple departure toward Coeur d'Alene.",
          "adventure": {
            "briefing": {
              "explorer": "Today the road climbs into Glacier National Park. Watch for waterfalls, snow patches, wildlife, and the Continental Divide sign before descending toward Kalispell.",
              "navigator": "This is the most complex route day: border timing, park congestion, steep terrain, changing weather, and a major scenic crossing. Keep a field record of what changes with elevation."
            },
            "missions": [
              {
                "id": "border-sign",
                "label": "Spot the United States entry sign",
                "audience": "all"
              },
              {
                "id": "divide",
                "label": "Find the Continental Divide marker at Logan Pass",
                "audience": "all"
              },
              {
                "id": "temp-compare",
                "label": "Compare the valley temperature with Logan Pass",
                "audience": "navigator"
              },
              {
                "id": "park-map",
                "label": "Trace the east-to-west route across the park map",
                "audience": "explorer"
              },
              {
                "id": "layer-check",
                "label": "Remember a warm layer before leaving the vehicle at high elevation",
                "audience": "all"
              }
            ],
            "spotting": [
              {
                "id": "mountain-goat",
                "label": "Mountain goat",
                "icon": "△",
                "target": 1
              },
              {
                "id": "bighorn",
                "label": "Bighorn sheep",
                "icon": "⌁",
                "target": 1
              },
              {
                "id": "waterfall",
                "label": "Roadside waterfall",
                "icon": "≈",
                "target": 3
              },
              {
                "id": "snow-patch",
                "label": "Summer snow patch",
                "icon": "◇",
                "target": 3
              },
              {
                "id": "red-bus",
                "label": "Red park bus",
                "icon": "▰",
                "target": 1
              },
              {
                "id": "wildlife-jam",
                "label": "Wildlife traffic slowdown",
                "icon": "!",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "High point by road",
                "text": "Logan Pass sits where Going-to-the-Sun Road crosses the Continental Divide at 6,646 feet (2,025 metres). It is the highest place in Glacier National Park reachable by vehicle.",
                "prompt": "Notice how plants and weather change near the pass.",
                "sourceLabel": "National Park Service",
                "sourceUrl": "https://www.nps.gov/glac/planyourvisit/placestogo.htm"
              },
              {
                "title": "2026 access change",
                "text": "Glacier does not require a vehicle reservation in 2026, but private-vehicle parking at Logan Pass is limited to three hours and can fill very early.",
                "prompt": "What backup plan would you choose if the lot is full?",
                "sourceLabel": "National Park Service",
                "sourceUrl": "https://www.nps.gov/glac/learn/news/glacier-national-park-announces-2026-summer-operations.htm"
              }
            ],
            "photoMission": {
              "explorer": "Take a photo that includes mountains, sky, and water in the same frame.",
              "navigator": "Photograph one detail that reveals elevation—snow, alpine plants, cloud, or rock—rather than only a wide landscape."
            },
            "badge": {
              "id": "continental-divide",
              "name": "Continental Divide",
              "icon": "△",
              "description": "Crossed Glacier National Park from east to west."
            },
            "teaser": {
              "title": "Tomorrow: a time-zone hop",
              "text": "After breakfast in Kalispell, the route turns west into Idaho and reaches Coeur d’Alene for a two-night base."
            }
          }
        },
        {
          "id": "day-3",
          "date": "2026-08-01",
          "shortDate": "Aug 1",
          "title": "Kalispell to Coeur d'Alene",
          "start": "Kalispell, MT",
          "end": "Coeur d'Alene, ID",
          "overnight": "Coeur d'Alene, ID",
          "distanceKm": 325,
          "driveTime": "about 3 hr 45 min",
          "departure": "unhurried morning",
          "arrival": "mid-afternoon",
          "tone": "travel",
          "summary": "Leave Kalispell after breakfast, cross into Idaho, and settle into Coeur d'Alene for two nights.",
          "timeZoneNote": "You gain one hour travelling from Montana to northern Idaho. Coeur d'Alene uses Pacific Time.",
          "stops": [
            "Kalispell, MT",
            "Coeur d'Alene, ID"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Breakfast in Kalispell",
              "detail": "Keep the morning relaxed after the long Glacier day."
            },
            {
              "time": "Late morning",
              "title": "Drive west",
              "detail": "Enjoy the mountain route and remember the one-hour time change."
            },
            {
              "time": "Mid-afternoon",
              "title": "Arrive in Coeur d'Alene",
              "detail": "Check in for two nights and unload before heading out."
            },
            {
              "time": "Evening",
              "title": "Coeur d'Alene evening",
              "detail": "Choose downtown shopping, dinner, or a short lakeside walk without committing to another beach day."
            }
          ],
          "mustDo": [
            "Account for the one-hour time gain.",
            "Settle into the same hotel for August 1 and 2.",
            "Confirm Silverwood tickets and park hours for the next day."
          ],
          "optional": [
            "Downtown Coeur d'Alene boutiques, dinner, or a brief waterfront walk."
          ],
          "alerts": [
            "This is a flexible travel and reset day after Glacier, with a two-night Coeur d’Alene stay ahead."
          ],
          "hotelHint": "Two-night Coeur d'Alene stay, checking in August 1 and out August 3.",
          "adventure": {
            "briefing": {
              "explorer": "Today is a calmer mountain drive. Watch the clock jump back one hour as Montana gives way to northern Idaho and a lake city becomes home for two nights.",
              "navigator": "Use the time-zone gain well: monitor the route, choose a sensible stop, and help the family arrive early enough to enjoy Coeur d’Alene without rushing."
            },
            "missions": [
              {
                "id": "time-change",
                "label": "Notice when the phone changes from Mountain to Pacific Time",
                "audience": "all"
              },
              {
                "id": "state-line",
                "label": "Spot the Idaho state-line sign",
                "audience": "all"
              },
              {
                "id": "lunch-choice",
                "label": "Help choose a lunch stop that does not add a large detour",
                "audience": "navigator"
              },
              {
                "id": "lake-arrival",
                "label": "Find Lake Coeur d’Alene on the map before arriving",
                "audience": "explorer"
              }
            ],
            "spotting": [
              {
                "id": "logging-truck",
                "label": "Logging truck",
                "icon": "▰",
                "target": 3
              },
              {
                "id": "river-bridge",
                "label": "River bridge",
                "icon": "⌒",
                "target": 2
              },
              {
                "id": "idaho-plate",
                "label": "Idaho plate",
                "icon": "ID",
                "target": 5
              },
              {
                "id": "osprey",
                "label": "Osprey",
                "icon": "⌃",
                "target": 1
              },
              {
                "id": "lake-first-view",
                "label": "First lake view",
                "icon": "≈",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "A long northern lake",
                "text": "Lake Coeur d’Alene stretches more than 26 miles and has about 135 miles of shoreline.",
                "prompt": "Can you tell which direction the lake continues beyond downtown?",
                "sourceLabel": "Visit North Idaho",
                "sourceUrl": "https://visitnorthidaho.com/activity/lake-coeur-d-alene/"
              }
            ],
            "photoMission": {
              "explorer": "Take a first-arrival photo that makes Coeur d’Alene look exciting.",
              "navigator": "Create a clean “place-setter” image for the scrapbook: one photo that clearly says Coeur d’Alene."
            },
            "badge": {
              "id": "time-traveller",
              "name": "Time Traveller",
              "icon": "◷",
              "description": "Crossed a state line and gained an hour without losing the route."
            },
            "teaser": {
              "title": "Tomorrow: field test Silverwood",
              "text": "Rides, water slides, and one full day to decide which attraction deserves the family’s top rating."
            }
          }
        },
        {
          "id": "day-4",
          "date": "2026-08-02",
          "shortDate": "Aug 2",
          "title": "Silverwood from Coeur d'Alene",
          "start": "Coeur d'Alene, ID",
          "end": "Coeur d'Alene, ID",
          "overnight": "Coeur d'Alene, ID",
          "distanceKm": 100,
          "driveTime": "about 1 hr 20 min round trip, plus the park day",
          "departure": "morning",
          "arrival": "after park close",
          "tone": "rides",
          "summary": "Spend the day at Silverwood and Boulder Beach, then return to the same Coeur d'Alene hotel.",
          "timeZoneNote": "Pacific Time all day.",
          "stops": [
            "Coeur d'Alene, ID",
            "Silverwood Theme Park, Athol, ID",
            "Coeur d'Alene, ID"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Leave Coeur d'Alene",
              "detail": "The park is roughly 35 to 45 minutes north, depending on traffic."
            },
            {
              "time": "Park opening",
              "title": "Silverwood and Boulder Beach",
              "detail": "Use a locker for dry clothes and valuables and agree on a family meeting point."
            },
            {
              "time": "Afternoon",
              "title": "Water park and rides",
              "detail": "Balance thrill rides with enough downtime for everyone."
            },
            {
              "time": "After close",
              "title": "Return to Coeur d'Alene",
              "detail": "No hotel change tonight; return to the same room."
            }
          ],
          "mustDo": [
            "Pack swimwear, towels, sunscreen, water shoes, and dry clothes in one easy-to-carry park bag.",
            "Confirm park hours the night before because operating schedules can change.",
            "Measure or review ride restrictions before queueing.",
            "Set a meeting point and check-in times for independent ride choices."
          ],
          "optional": [
            "Easy late supper in Coeur d'Alene after the park."
          ],
          "alerts": [
            "The two-night stay eliminates packing and a late-night drive to Spokane Valley."
          ],
          "hotelHint": "Second night at the same Coeur d'Alene hotel.",
          "adventure": {
            "briefing": {
              "explorer": "Today is the biggest thrill day. Try something new, keep track of the best rides, and decide whether the water park or the coasters win.",
              "navigator": "Act as a park reviewer: track wait times, test at least one attraction outside your usual comfort zone, and build a defensible top-three list."
            },
            "missions": [
              {
                "id": "new-ride",
                "label": "Try one ride or slide you have never done before",
                "audience": "all"
              },
              {
                "id": "top-three",
                "label": "Choose and rank your top three attractions",
                "audience": "all"
              },
              {
                "id": "wait-time",
                "label": "Record the longest wait of the day",
                "audience": "navigator"
              },
              {
                "id": "family-photo",
                "label": "Get one family photo before everyone is soaked or exhausted",
                "audience": "all"
              },
              {
                "id": "meet-point",
                "label": "Remember the family meeting point without asking",
                "audience": "explorer"
              }
            ],
            "spotting": [
              {
                "id": "inversion",
                "label": "Coaster inversion",
                "icon": "∞",
                "target": 3
              },
              {
                "id": "train-whistle",
                "label": "Train whistle",
                "icon": "↔",
                "target": 1
              },
              {
                "id": "soaked-person",
                "label": "Completely soaked person",
                "icon": "≈",
                "target": 5
              },
              {
                "id": "ride-photo",
                "label": "On-ride photo screen",
                "icon": "▣",
                "target": 2
              },
              {
                "id": "waterfall-ride",
                "label": "Ride splash bigger than expected",
                "icon": "!",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "More than coasters",
                "text": "Silverwood advertises more than 70 rides, slides, shows, and attractions, including Boulder Beach Water Park and a steam train.",
                "prompt": "Which attraction category gives the best value for time spent waiting?",
                "sourceLabel": "Silverwood Theme Park",
                "sourceUrl": "https://www.silverwoodthemepark.com/"
              }
            ],
            "photoMission": {
              "explorer": "Capture the funniest wet-hair or post-ride reaction.",
              "navigator": "Take one dynamic photo that shows motion without relying on an on-ride camera."
            },
            "badge": {
              "id": "field-tester",
              "name": "Silverwood Field Tester",
              "icon": "∞",
              "description": "Tested the park and produced a ranked verdict."
            },
            "teaser": {
              "title": "Tomorrow: retail mission, then Sandpoint",
              "text": "The route swings through Spokane Valley shopping before turning north to a smaller downtown beside Lake Pend Oreille."
            }
          }
        },
        {
          "id": "day-5",
          "date": "2026-08-03",
          "shortDate": "Aug 3",
          "title": "Coeur d'Alene and Spokane shopping to Sandpoint",
          "start": "Coeur d'Alene, ID",
          "end": "Sandpoint, ID",
          "overnight": "Sandpoint, ID",
          "distanceKm": 195,
          "driveTime": "about 2 hr 30 min driving, plus shopping",
          "departure": "morning",
          "arrival": "late afternoon or evening",
          "tone": "shopping",
          "summary": "Check out of Coeur d'Alene, work through the Spokane Valley shopping list, then turn north for Sandpoint.",
          "timeZoneNote": "Pacific Time all day.",
          "stops": [
            "Coeur d'Alene, ID",
            "Spokane Valley Mall, Spokane Valley, WA",
            "Post Falls, ID",
            "Sandpoint, ID"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Check out in Coeur d'Alene",
              "detail": "Load the vehicle once, then head west for the planned shopping loop."
            },
            {
              "time": "Late morning",
              "title": "Spokane Valley Mall",
              "detail": "Victoria's Secret and PINK is the required stop. The mall also groups several teen-friendly stores together."
            },
            {
              "time": "Afternoon",
              "title": "Finish the shopping loop",
              "detail": "Use Post Falls or Coeur d'Alene stops only where they fit naturally on the route north."
            },
            {
              "time": "Late afternoon",
              "title": "Drive to Sandpoint",
              "detail": "Continue north for the overnight and downtown browsing or dinner."
            }
          ],
          "mustDo": [
            "Victoria's Secret and PINK at Spokane Valley Mall.",
            "Keep receipts together for the Canadian border return.",
            "Protect enough time to reach Sandpoint without making the evening feel rushed."
          ],
          "optional": [
            "Trader Joe’s remains an optional Spokane detour.",
            "Downtown Sandpoint shopping and dinner after check-in."
          ],
          "alerts": [
            "There is no Spokane Valley overnight; all shopping happens en route from Coeur d'Alene to Sandpoint."
          ],
          "hotelHint": "Sandpoint for one night, ideally close enough to downtown for an easy dinner and shopping stroll.",
          "adventure": {
            "briefing": {
              "explorer": "Today is a store-and-road challenge. Help find the priority stops, keep track of unusual things you see, and save enough energy for Sandpoint.",
              "navigator": "Treat shopping like route planning: group stops efficiently, monitor the clock, and record the one purchase or discovery most worth remembering."
            },
            "missions": [
              {
                "id": "priority-store",
                "label": "Reach the family’s priority store before optional stops",
                "audience": "all"
              },
              {
                "id": "route-efficiency",
                "label": "Suggest the most efficient order for two shopping stops",
                "audience": "navigator"
              },
              {
                "id": "unique-find",
                "label": "Find one item or snack not normally seen at home",
                "audience": "all"
              },
              {
                "id": "receipt-helper",
                "label": "Help keep receipts together for the border return",
                "audience": "explorer"
              },
              {
                "id": "sandpoint-arrival",
                "label": "Arrive in Sandpoint with time for dinner or a downtown browse",
                "audience": "all"
              }
            ],
            "spotting": [
              {
                "id": "washington-plate",
                "label": "Washington plate",
                "icon": "WA",
                "target": 5
              },
              {
                "id": "target-logo",
                "label": "Target bullseye",
                "icon": "◎",
                "target": 1
              },
              {
                "id": "mountain-parking",
                "label": "Mountain view from a parking lot",
                "icon": "△",
                "target": 1
              },
              {
                "id": "train-crossing",
                "label": "Rail crossing",
                "icon": "×",
                "target": 2
              },
              {
                "id": "boat-trailer",
                "label": "Boat on a trailer",
                "icon": "⌁",
                "target": 4
              }
            ],
            "facts": [
              {
                "title": "Water beside downtown",
                "text": "Sandpoint’s City Beach sits directly beside downtown with broad views across Lake Pend Oreille.",
                "prompt": "Does a lake change the feel of a shopping downtown even when you do not visit the beach?",
                "sourceLabel": "Visit Sandpoint",
                "sourceUrl": "https://visitsandpoint.com/play/outdoor-recreation/lake-pend-oreille-activities/"
              }
            ],
            "photoMission": {
              "explorer": "Photograph the strangest or funniest thing found in a store today.",
              "navigator": "Take a street-level photo that shows Sandpoint as a town, not only as a lake destination."
            },
            "badge": {
              "id": "route-curator",
              "name": "Route Curator",
              "icon": "⌖",
              "description": "Balanced shopping priorities with a successful northbound travel day."
            },
            "teaser": {
              "title": "Tomorrow: border, artisans, and a ferry",
              "text": "The route follows the Selkirk country into Canada, pauses near Crawford Bay, and drives onto a ferry across Kootenay Lake."
            }
          }
        },
        {
          "id": "day-6",
          "date": "2026-08-04",
          "shortDate": "Aug 4",
          "title": "Sandpoint to Nelson",
          "start": "Sandpoint, ID",
          "end": "Nelson, BC",
          "overnight": "Nelson, BC",
          "distanceKm": 270,
          "driveTime": "about 4 hr 15 min driving, plus border, ferry wait, and crossing",
          "departure": "late morning",
          "arrival": "mid-afternoon",
          "tone": "lakes",
          "summary": "Follow the International Selkirk Loop through Creston and Crawford Bay, then ride the free Kootenay Lake Ferry to Balfour before Nelson.",
          "timeZoneNote": "Pacific Time on both sides of this border crossing.",
          "stops": [
            "Sandpoint, ID",
            "Porthill-Rykerts Border Crossing",
            "Creston, BC",
            "Crawford Bay, BC",
            "Kootenay Bay Ferry Terminal, BC",
            "Balfour Ferry Terminal, BC",
            "Nelson, BC"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Breakfast and a little downtown Sandpoint",
              "detail": "Keep this easy: coffee, a few shops if desired, then leave the beach behind."
            },
            {
              "time": "Late morning",
              "title": "Drive toward Porthill",
              "detail": "Fuel before the border and make sure all shopping receipts are accessible."
            },
            {
              "time": "Early afternoon",
              "title": "Cross into Canada",
              "detail": "Declare purchases accurately and expect the schedule to flex with the border wait."
            },
            {
              "time": "Afternoon",
              "title": "Crawford Bay artisans",
              "detail": "Browse the compact artisan cluster only if it appeals; it is an easy shopping-friendly stop before the ferry."
            },
            {
              "time": "Afternoon",
              "title": "Kootenay Lake Ferry",
              "detail": "Queue at Kootenay Bay for the free 35-minute crossing to Balfour. Build in summer wait time."
            },
            {
              "time": "Late afternoon",
              "title": "Arrive in Nelson",
              "detail": "Check in, then browse Baker Street and choose dinner downtown."
            }
          ],
          "mustDo": [
            "Organize passports and receipts before reaching the border.",
            "Fill the tank before the rural portion of the drive.",
            "Check the official ferry and DriveBC status before leaving Creston.",
            "Leave enough daylight to enjoy Nelson rather than treating it only as a sleep stop."
          ],
          "optional": [
            "Creston fruit stand or a short local-food stop.",
            "Crawford Bay artisan shops before the ferry."
          ],
          "alerts": [
            "Border processing and ferry queue time are not included in the driving estimate.",
            "Use a daytime crossing. Recheck Porthill/Rykerts hours before August 4.",
            "The Kootenay Lake ferry is free and the crossing is about 35 minutes, but summer lineups can add time."
          ],
          "hotelHint": "Downtown Nelson is worth prioritizing because the evening becomes walkable once the car is parked.",
          "adventure": {
            "briefing": {
              "explorer": "Today includes a border and a boat big enough to carry the car. Watch for orchard country, artisan signs, birds over the lake, and the ferry wake.",
              "navigator": "This is a logistics-and-scenery day: border documents, rural fuel, ferry timing, and enough daylight to reach historic Nelson without rushing."
            },
            "missions": [
              {
                "id": "border-ready",
                "label": "Have passport and shopping receipts ready before the border booth",
                "audience": "all"
              },
              {
                "id": "ferry-check",
                "label": "Check the ferry status before leaving Creston",
                "audience": "navigator"
              },
              {
                "id": "deck-walk",
                "label": "Step out on deck during the crossing if conditions allow",
                "audience": "all"
              },
              {
                "id": "artisan-find",
                "label": "Find one handmade object or working studio in Crawford Bay",
                "audience": "explorer"
              },
              {
                "id": "wake-photo",
                "label": "Capture the ferry wake or shoreline from the boat",
                "audience": "all"
              }
            ],
            "spotting": [
              {
                "id": "canada-flag",
                "label": "Canadian flag after re-entry",
                "icon": "◆",
                "target": 1
              },
              {
                "id": "orchard",
                "label": "Orchard row",
                "icon": "⋮",
                "target": 3
              },
              {
                "id": "artisan-sign",
                "label": "Artisan studio sign",
                "icon": "✧",
                "target": 2
              },
              {
                "id": "ferry",
                "label": "Ferry",
                "icon": "▱",
                "target": 1
              },
              {
                "id": "osprey-ferry",
                "label": "Osprey or eagle over the lake",
                "icon": "⌃",
                "target": 1
              },
              {
                "id": "motorcycle",
                "label": "Touring motorcycle",
                "icon": "○",
                "target": 5
              }
            ],
            "facts": [
              {
                "title": "A real part of Highway 3A",
                "text": "The Kootenay Lake Ferry links Kootenay Bay and Balfour. The crossing takes about 35 minutes and the provincial inland-ferry service is free.",
                "prompt": "Why might a ferry make more sense here than a bridge?",
                "sourceLabel": "Province of British Columbia",
                "sourceUrl": "https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/water-travel/inland-ferries/kootenay-lake-ferry"
              },
              {
                "title": "Heritage streets",
                "text": "Nelson has hundreds of restored heritage buildings and is recognized by the city as British Columbia’s Heritage Capital.",
                "prompt": "Look for details above street level—cornices, brickwork, and old signs.",
                "sourceLabel": "City of Nelson",
                "sourceUrl": "https://www.nelson.ca/490/Heritage"
              }
            ],
            "photoMission": {
              "explorer": "Take a photo from the ferry that proves the car is travelling by boat.",
              "navigator": "Build a three-image sequence: approach, crossing, and arrival."
            },
            "badge": {
              "id": "ferry-navigator",
              "name": "Ferry Navigator",
              "icon": "▱",
              "description": "Managed a border crossing and crossed Kootenay Lake by ferry."
            },
            "teaser": {
              "title": "Tomorrow: Boundary Country to the Okanagan",
              "text": "Historic towns, orchards, warm valley scenery, and a planned meetup in Penticton."
            }
          }
        },
        {
          "id": "day-7",
          "date": "2026-08-05",
          "shortDate": "Aug 5",
          "title": "Nelson to Penticton",
          "start": "Nelson, BC",
          "end": "Penticton, BC",
          "overnight": "Penticton, BC",
          "distanceKm": 325,
          "driveTime": "about 5 hr, before stops",
          "departure": "morning",
          "arrival": "mid- to late afternoon",
          "tone": "okanagan",
          "summary": "Follow Highway 3 through Castlegar, Grand Forks, Greenwood, Osoyoos, and Oliver to meet your friend in Penticton.",
          "timeZoneNote": "Pacific Time all day.",
          "stops": [
            "Nelson, BC",
            "Grand Forks, BC",
            "Greenwood, BC",
            "Osoyoos, BC",
            "Penticton, BC"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Leave Nelson",
              "detail": "This is a scenic two-lane highway day, not a freeway sprint."
            },
            {
              "time": "Midday",
              "title": "Boundary Country",
              "detail": "Choose one sensible meal or stretch stop in Grand Forks or Greenwood."
            },
            {
              "time": "Afternoon",
              "title": "Osoyoos and Oliver",
              "detail": "Fruit stands or a short lake viewpoint are easy additions if the Penticton meetup time allows."
            },
            {
              "time": "Late afternoon",
              "title": "Meet up in Penticton",
              "detail": "Protect the social time by not overloading the route with stops."
            }
          ],
          "mustDo": [
            "Confirm the Penticton meetup time before leaving Nelson.",
            "Carry water and snacks for the Highway 3 drive.",
            "Choose only one or two route stops so Penticton remains the focus."
          ],
          "optional": [
            "Greenwood walk, Osoyoos lake view, or an orchard stop."
          ],
          "alerts": [
            "The earlier estimate for this leg was too short. Plan on roughly 325 km and about five hours of wheel time before sightseeing."
          ],
          "hotelHint": "Near Okanagan Lake or downtown is convenient for the meetup and an evening waterfront walk.",
          "adventure": {
            "briefing": {
              "explorer": "Today moves from mountain-town streets to orchards and warm lakes. Watch for fruit stands, vineyards, and the first sign that the Okanagan is getting close.",
              "navigator": "Highway 3 is scenic but time-consuming. Choose only the stops that add real value and protect the Penticton meetup."
            },
            "missions": [
              {
                "id": "meetup-check",
                "label": "Confirm the Penticton meetup time before leaving Nelson",
                "audience": "all"
              },
              {
                "id": "one-stop-rule",
                "label": "Choose one route stop worth the time and explain why",
                "audience": "navigator"
              },
              {
                "id": "fruit-find",
                "label": "Find a BC fruit stand or orchard product",
                "audience": "all"
              },
              {
                "id": "two-lakes",
                "label": "Find both Okanagan Lake and Skaha Lake on the map",
                "audience": "explorer"
              }
            ],
            "spotting": [
              {
                "id": "fruit-stand",
                "label": "Fruit stand",
                "icon": "●",
                "target": 3
              },
              {
                "id": "vineyard",
                "label": "Vineyard rows",
                "icon": "≋",
                "target": 3
              },
              {
                "id": "orchard-bin",
                "label": "Orchard bin or fruit truck",
                "icon": "▣",
                "target": 2
              },
              {
                "id": "lake-view",
                "label": "Long lake view",
                "icon": "≈",
                "target": 2
              },
              {
                "id": "historic-main",
                "label": "Historic main street",
                "icon": "▥",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "Between two lakes",
                "text": "Penticton is one of only two cities in the world situated between two lakes: Okanagan Lake and Skaha Lake.",
                "prompt": "Which lake is north and which is south?",
                "sourceLabel": "Visit Penticton",
                "sourceUrl": "https://visitpenticton.com/about-penticton/"
              }
            ],
            "photoMission": {
              "explorer": "Photograph the brightest fruit or most colourful roadside stand.",
              "navigator": "Take one image that shows the visual change from Kootenay mountains to Okanagan landscape."
            },
            "badge": {
              "id": "okanagan-arrival",
              "name": "Okanagan Arrival",
              "icon": "≈",
              "description": "Crossed Boundary Country and reached the city between two lakes."
            },
            "teaser": {
              "title": "Tomorrow: kangaroos, capybaras, and a long northbound run",
              "text": "An early farm visit near Kelowna comes before the drive through Kamloops to Clearwater."
            }
          }
        },
        {
          "id": "day-8",
          "date": "2026-08-06",
          "shortDate": "Aug 6",
          "title": "Penticton, Kangaroo Creek Farm, and Clearwater",
          "start": "Penticton, BC",
          "end": "Clearwater, BC",
          "overnight": "Clearwater, BC",
          "distanceKm": 430,
          "driveTime": "about 5 hr 15 min driving, plus the farm visit and stops",
          "departure": "about 8:00 AM",
          "arrival": "late afternoon or early evening",
          "tone": "waterfalls",
          "summary": "Leave Penticton early, visit Kangaroo Creek Farm during its 9:00 AM–3:00 PM hours, then continue through the Thompson corridor to Clearwater.",
          "timeZoneNote": "Pacific Time all day.",
          "stops": [
            "Penticton, BC",
            "Kangaroo Creek Farm, 5932 Old Vernon Rd, Kelowna, BC",
            "Kamloops, BC",
            "Clearwater, BC"
          ],
          "timeline": [
            {
              "time": "8:00 AM",
              "title": "Leave Penticton",
              "detail": "An early start keeps the animal visit comfortable and protects the long afternoon drive."
            },
            {
              "time": "9:15–11:15 AM",
              "title": "Kangaroo Creek Farm",
              "detail": "The farm is open 9:00 AM–3:00 PM daily. Earlier is cooler and usually more active."
            },
            {
              "time": "Midday",
              "title": "Lunch and turn north",
              "detail": "Leave Kelowna with enough time for the drive through Vernon and Kamloops."
            },
            {
              "time": "Late afternoon",
              "title": "Arrive in Clearwater",
              "detail": "Settle in and decide whether Spahats Falls fits tonight or belongs with the next morning."
            }
          ],
          "mustDo": [
            "Leave Penticton early enough to arrive comfortably within the farm’s 9:00 AM–3:00 PM hours.",
            "Bring water and sun protection for the farm.",
            "Fuel before leaving the larger Okanagan centres.",
            "Keep the evening flexible after the long drive."
          ],
          "optional": [
            "Spahats Falls if daylight and energy remain."
          ],
          "alerts": [
            "The farm visit makes this a full day. Avoid lingering in Kelowna so Clearwater does not become a late arrival.",
            "Waterfall access adds distance and time beyond the town-to-town estimate."
          ],
          "hotelHint": "Clearwater is the overnight base for Wells Gray and the next day’s drive toward Hinton.",
          "adventure": {
            "briefing": {
              "explorer": "Today starts with kangaroos, wallabies, capybaras, and emus. After the farm, the route turns into a long drive toward waterfall country.",
              "navigator": "The farm has a hard closing time and Clearwater is still several hours away. Manage the visit, document the animals, and protect the afternoon schedule."
            },
            "missions": [
              {
                "id": "farm-on-time",
                "label": "Arrive at Kangaroo Creek Farm during its 9:00 AM–3:00 PM hours",
                "audience": "all"
              },
              {
                "id": "animal-fact",
                "label": "Learn one fact about an animal you did not know before",
                "audience": "all"
              },
              {
                "id": "farm-clock",
                "label": "Choose a departure time from the farm and help the family keep it",
                "audience": "navigator"
              },
              {
                "id": "favorite-animal",
                "label": "Pick a favourite animal and explain the choice",
                "audience": "explorer"
              },
              {
                "id": "clearwater-map",
                "label": "Find Clearwater before leaving the Okanagan",
                "audience": "all"
              }
            ],
            "spotting": [
              {
                "id": "kangaroo",
                "label": "Kangaroo",
                "icon": "K",
                "target": 3
              },
              {
                "id": "wallaby",
                "label": "Wallaby",
                "icon": "W",
                "target": 3
              },
              {
                "id": "capybara",
                "label": "Capybara",
                "icon": "C",
                "target": 1
              },
              {
                "id": "emu",
                "label": "Emu",
                "icon": "E",
                "target": 1
              },
              {
                "id": "peacock",
                "label": "Peacock or peahen",
                "icon": "P",
                "target": 1
              },
              {
                "id": "orchard-farm",
                "label": "Orchard on the road north",
                "icon": "⋮",
                "target": 3
              }
            ],
            "facts": [
              {
                "title": "More than kangaroos",
                "text": "Kangaroo Creek Farm also keeps wallabies, emus, capybaras, sugar gliders, parrots, pigs, goats, tortoises, and other animals.",
                "prompt": "Which animal seems least related to the farm’s name?",
                "sourceLabel": "Kangaroo Creek Farm",
                "sourceUrl": "https://www.kangaroocreekfarm.com/meet-the-animals-of-kangaroo-creek-farm/"
              },
              {
                "title": "Largest living rodent",
                "text": "The capybara is the largest living rodent in the world.",
                "prompt": "What familiar animal does its shape or behaviour remind you of?",
                "sourceLabel": "Kangaroo Creek Farm",
                "sourceUrl": "https://www.kangaroocreekfarm.com/meet-the-animals-of-kangaroo-creek-farm/"
              }
            ],
            "photoMission": {
              "explorer": "Take a respectful close-up of your favourite animal.",
              "navigator": "Create an animal portrait that shows behaviour or personality, not only the enclosure."
            },
            "badge": {
              "id": "wildlife-correspondent",
              "name": "Wildlife Correspondent",
              "icon": "K",
              "description": "Completed the farm field visit and reported a new animal fact."
            },
            "teaser": {
              "title": "Tomorrow: waterfall survey and the Rockies",
              "text": "Wells Gray, Mount Robson country, Jasper, a time-zone change, and the final overnight in Hinton."
            }
          }
        },
        {
          "id": "day-9",
          "date": "2026-08-07",
          "shortDate": "Aug 7",
          "title": "Clearwater to Hinton",
          "start": "Clearwater, BC",
          "end": "Hinton, AB",
          "overnight": "Hinton, AB",
          "distanceKm": 398,
          "driveTime": "about 4 hr 30 min before stops",
          "departure": "morning",
          "arrival": "late afternoon",
          "tone": "rockies",
          "summary": "Choose one Wells Gray highlight, then travel through Valemount, Mount Robson country, Jasper, and the Yellowhead to Hinton.",
          "timeZoneNote": "You lose one hour when entering Alberta and Mountain Time.",
          "stops": [
            "Clearwater, BC",
            "Helmcken Falls, Wells Gray Provincial Park",
            "Valemount, BC",
            "Mount Robson Visitor Centre, BC",
            "Jasper, AB",
            "Hinton, AB"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Helmcken Falls",
              "detail": "The viewpoint is the signature Wells Gray stop, but the park access road adds meaningful time."
            },
            {
              "time": "Late morning",
              "title": "Return to Highway 5",
              "detail": "Fuel in Clearwater or Valemount before the mountain corridor."
            },
            {
              "time": "Afternoon",
              "title": "Mount Robson and Jasper route",
              "detail": "Use short viewpoints rather than turning the day into another full park itinerary."
            },
            {
              "time": "Late afternoon",
              "title": "Arrive in Hinton",
              "detail": "Final hotel night, repack the vehicle, and prepare for the direct run home."
            }
          ],
          "mustDo": [
            "Account for the one-hour time-zone loss.",
            "Check Highway 5 and Highway 16 conditions before departure.",
            "Keep wildlife distance and never stop in an active traffic lane for a sighting."
          ],
          "optional": [
            "Mount Robson viewpoint or a brief Jasper stop, depending on the day's pace."
          ],
          "alerts": [
            "Helmcken Falls is not a five-minute detour from the highway; allow time for the access road in both directions."
          ],
          "hotelHint": "A reliable chain hotel with breakfast and easy Highway 16 access is ideal for the final night.",
          "adventure": {
            "briefing": {
              "explorer": "Today starts in waterfall country and ends back in Alberta. Watch for spray, canyon walls, trains, mountain peaks, and wildlife along the Yellowhead.",
              "navigator": "Choose the waterfall stop carefully, account for the one-hour clock change, and monitor the long route through Mount Robson and Jasper country."
            },
            "missions": [
              {
                "id": "falls-choice",
                "label": "Choose the waterfall stop that best fits the day’s timing",
                "audience": "navigator"
              },
              {
                "id": "waterfall-view",
                "label": "See at least one Wells Gray waterfall",
                "audience": "all"
              },
              {
                "id": "robson-watch",
                "label": "Look for Mount Robson and record whether the summit is visible",
                "audience": "all"
              },
              {
                "id": "clock-forward",
                "label": "Notice the one-hour change back to Mountain Time",
                "audience": "explorer"
              },
              {
                "id": "wildlife-space",
                "label": "Model safe wildlife viewing without stopping in a traffic lane",
                "audience": "all"
              }
            ],
            "spotting": [
              {
                "id": "waterfall-day9",
                "label": "Waterfall",
                "icon": "≈",
                "target": 2
              },
              {
                "id": "train-day9",
                "label": "Long freight train",
                "icon": "↔",
                "target": 2
              },
              {
                "id": "robson-sign",
                "label": "Mount Robson sign",
                "icon": "△",
                "target": 1
              },
              {
                "id": "elk",
                "label": "Elk",
                "icon": "⌁",
                "target": 1
              },
              {
                "id": "river-canyon",
                "label": "River canyon",
                "icon": "∨",
                "target": 2
              },
              {
                "id": "alberta-sign",
                "label": "Welcome to Alberta sign",
                "icon": "AB",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "Waterfall country",
                "text": "Wells Gray Provincial Park is known for old-growth forest, volcanic landscapes, and a remarkable concentration of waterfalls.",
                "prompt": "Look for evidence that water and volcanic rock shaped the same landscape.",
                "sourceLabel": "BC Parks",
                "sourceUrl": "https://bcparks.ca/wells-gray-park/"
              }
            ],
            "photoMission": {
              "explorer": "Take a photo that shows how small people or trees look beside a waterfall or mountain.",
              "navigator": "Use foreground, middle distance, and background in one landscape image."
            },
            "badge": {
              "id": "waterfall-surveyor",
              "name": "Waterfall Surveyor",
              "icon": "≈",
              "description": "Documented Wells Gray and crossed back into Alberta mountain country."
            },
            "teaser": {
              "title": "Tomorrow: the homeward record",
              "text": "The final drive reaches Berwyn. The last mission is to choose the trip’s best story and complete the scrapbook."
            }
          }
        },
        {
          "id": "day-10",
          "date": "2026-08-08",
          "shortDate": "Aug 8",
          "title": "Hinton to Berwyn",
          "start": "Hinton, AB",
          "end": "Berwyn, AB",
          "overnight": "Home",
          "distanceKm": 470,
          "driveTime": "about 5 hr",
          "departure": "morning",
          "arrival": "afternoon",
          "tone": "home",
          "summary": "A straightforward final run through Grande Prairie and home to Berwyn before the Saturday deadline.",
          "timeZoneNote": "Mountain Time all day.",
          "stops": [
            "Hinton, AB",
            "Grande Prairie, AB",
            "Berwyn, AB"
          ],
          "timeline": [
            {
              "time": "Morning",
              "title": "Leave Hinton",
              "detail": "Start with a full tank and a simple breakfast."
            },
            {
              "time": "Midday",
              "title": "Grande Prairie break",
              "detail": "Fuel, lunch, and any last supplies."
            },
            {
              "time": "Afternoon",
              "title": "Arrive home in Berwyn",
              "detail": "Unload only the essentials and leave the full trip reset for the next day."
            }
          ],
          "mustDo": [
            "Confirm the final-day weather and road conditions.",
            "Keep the Saturday arrival buffer rather than adding a major detour."
          ],
          "optional": [
            "One relaxed lunch stop in Grande Prairie."
          ],
          "alerts": [
            "The goal is home no later than Saturday, August 8. Protect the buffer."
          ],
          "hotelHint": "No hotel - home night.",
          "adventure": {
            "briefing": {
              "explorer": "The final travel day is a victory lap. Watch familiar Alberta scenery return and help choose the trip’s funniest, wildest, and best moments.",
              "navigator": "Close the expedition well: protect the arrival buffer, collect final ratings, and turn the last kilometres into a useful trip record rather than dead time."
            },
            "missions": [
              {
                "id": "final-song",
                "label": "Choose the final official road-trip song",
                "audience": "all"
              },
              {
                "id": "trip-mvp",
                "label": "Name the trip’s single best moment",
                "audience": "all"
              },
              {
                "id": "family-poll",
                "label": "Ask each person for a one-sentence trip verdict",
                "audience": "navigator"
              },
              {
                "id": "home-sign",
                "label": "Spot the first road sign that truly feels like home",
                "audience": "explorer"
              },
              {
                "id": "final-journal",
                "label": "Complete the final journal before the day ends",
                "audience": "all"
              }
            ],
            "spotting": [
              {
                "id": "pumpjack",
                "label": "Pumpjack",
                "icon": "⌁",
                "target": 5
              },
              {
                "id": "farm-machine",
                "label": "Large farm machine",
                "icon": "▰",
                "target": 3
              },
              {
                "id": "peace-country",
                "label": "Peace Country sign or landmark",
                "icon": "⌖",
                "target": 1
              },
              {
                "id": "familiar-turn",
                "label": "A turn everyone recognizes",
                "icon": "↶",
                "target": 1
              },
              {
                "id": "home",
                "label": "Home",
                "icon": "⌂",
                "target": 1
              }
            ],
            "facts": [
              {
                "title": "The useful final kilometre",
                "text": "A trip is easier to remember when everyone records one specific detail before ordinary routines return.",
                "prompt": "Choose a detail—sound, smell, joke, meal, view, or mistake—that would otherwise be forgotten."
              }
            ],
            "photoMission": {
              "explorer": "Take the official “we made it home” photo.",
              "navigator": "Create the closing image for the scrapbook—something that feels like an ending, not just a driveway."
            },
            "badge": {
              "id": "homebound-historian",
              "name": "Homebound Historian",
              "icon": "⌂",
              "description": "Completed the loop and preserved the final story."
            },
            "teaser": {
              "title": "Adventure complete",
              "text": "The itinerary is finished, but the badges, ratings, field notes, and scrapbook stay in Road Companion."
            }
          }
        }
      ],
      "shopping": [
        {
          "category": "Required",
          "items": [
            {
              "id": "vs",
              "name": "Victoria's Secret and PINK",
              "detail": "Spokane Valley Mall, 14700 E Indiana Ave, Space 1146",
              "query": "Victoria's Secret Spokane Valley Mall"
            }
          ]
        },
        {
          "category": "Big-box priorities",
          "items": [
            {
              "id": "target",
              "name": "Target",
              "detail": "Choose the Spokane Valley location that best fits the loop",
              "query": "Target Spokane Valley WA"
            },
            {
              "id": "walmart",
              "name": "Walmart Supercenter",
              "detail": "Groceries, road supplies, and general shopping",
              "query": "Walmart Supercenter Spokane Valley WA"
            },
            {
              "id": "costco",
              "name": "Costco",
              "detail": "Only worthwhile if the family has a focused list",
              "query": "Costco Spokane Valley WA"
            },
            {
              "id": "bestbuy",
              "name": "Best Buy",
              "detail": "Electronics and travel accessories",
              "query": "Best Buy Spokane Valley WA"
            },
            {
              "id": "tjmaxx",
              "name": "TJ Maxx or Marshalls",
              "detail": "Discount clothing and home goods",
              "query": "TJ Maxx Spokane Valley WA"
            }
          ]
        },
        {
          "category": "Girls' stores",
          "items": [
            {
              "id": "ulta",
              "name": "Ulta Beauty",
              "detail": "Beauty and skin care",
              "query": "Ulta Beauty Spokane Valley WA"
            },
            {
              "id": "bathbody",
              "name": "Bath and Body Works",
              "detail": "Inside Spokane Valley Mall",
              "query": "Bath and Body Works Spokane Valley Mall"
            },
            {
              "id": "sephora",
              "name": "Sephora",
              "detail": "Inside Spokane Valley Mall",
              "query": "Sephora Spokane Valley Mall"
            },
            {
              "id": "hm",
              "name": "H and M",
              "detail": "Inside Spokane Valley Mall",
              "query": "H and M Spokane Valley Mall"
            }
          ]
        },
        {
          "category": "Optional detours",
          "items": [
            {
              "id": "traderjoes",
              "name": "Trader Joe's",
              "detail": "Not in the tight mall cluster; add only if it matters",
              "query": "Trader Joe's Spokane WA"
            },
            {
              "id": "rei",
              "name": "REI",
              "detail": "Outdoor gear; likely a Spokane detour",
              "query": "REI Spokane WA"
            }
          ]
        }
      ],
      "packing": [
        {
          "category": "Documents and money",
          "items": [
            {
              "id": "passports",
              "name": "Passports for all four travellers"
            },
            {
              "id": "silverwood-tickets",
              "name": "Silverwood tickets or purchase plan"
            },
            {
              "id": "insurance",
              "name": "Travel medical insurance details"
            },
            {
              "id": "vehicle-docs",
              "name": "Registration, insurance, roadside assistance"
            },
            {
              "id": "cards-cash",
              "name": "Credit cards and some US cash"
            },
            {
              "id": "receipts-envelope",
              "name": "Envelope or pouch for US shopping receipts"
            }
          ]
        },
        {
          "category": "Glacier and outdoors",
          "items": [
            {
              "id": "layers",
              "name": "Warm layers and light rain shells"
            },
            {
              "id": "shoes",
              "name": "Comfortable walking shoes"
            },
            {
              "id": "sunscreen",
              "name": "Sunscreen and lip balm"
            },
            {
              "id": "water",
              "name": "Refillable water bottles"
            },
            {
              "id": "binoculars",
              "name": "Binoculars"
            },
            {
              "id": "daypack",
              "name": "Small daypack"
            },
            {
              "id": "cooler",
              "name": "Small cooler and road snacks"
            }
          ]
        },
        {
          "category": "Silverwood and swimming",
          "items": [
            {
              "id": "swimsuits",
              "name": "Swimsuits"
            },
            {
              "id": "towels",
              "name": "Quick-dry towels"
            },
            {
              "id": "water-shoes",
              "name": "Water shoes or secure sandals"
            },
            {
              "id": "dry-clothes",
              "name": "Dry change of clothes in one park bag"
            },
            {
              "id": "locker-plan",
              "name": "Locker plan and waterproof phone pouch"
            }
          ]
        },
        {
          "category": "Road comfort",
          "items": [
            {
              "id": "offline-maps",
              "name": "Offline Google Maps areas downloaded"
            },
            {
              "id": "chargers",
              "name": "Car chargers and spare cables"
            },
            {
              "id": "medications",
              "name": "Medications and basic first-aid kit"
            },
            {
              "id": "laundry",
              "name": "Laundry bag and small detergent supply"
            },
            {
              "id": "pillows",
              "name": "Road pillows or light blankets"
            },
            {
              "id": "entertainment",
              "name": "Audiobooks, playlists, and downloads"
            }
          ]
        }
      ],
      "borderChecklist": [
        {
          "id": "border-passports",
          "name": "Passports are accessible from the front seat"
        },
        {
          "id": "border-purpose",
          "name": "Trip purpose and overnight plan are easy to explain"
        },
        {
          "id": "border-food",
          "name": "Food and agricultural items reviewed before each crossing"
        },
        {
          "id": "border-receipts",
          "name": "Receipts and purchase totals are organized for return to Canada"
        },
        {
          "id": "border-restrictions",
          "name": "Current customs and border notices checked"
        }
      ],
      "reminders": [
        {
          "id": "book-hotels",
          "text": "Enter each hotel and confirmation number in the Stays section."
        },
        {
          "id": "download-maps",
          "text": "Download offline map areas before leaving reliable service."
        },
        {
          "id": "park-status",
          "text": "Recheck Glacier road, trail, weather, and wildfire conditions on July 30."
        },
        {
          "id": "silverwood-hours",
          "text": "Reconfirm Silverwood and Boulder Beach hours before August 2."
        },
        {
          "id": "porthill-hours",
          "text": "Recheck both Porthill and Rykerts border hours before the August 4 crossing."
        },
        {
          "id": "share-backup",
          "text": "Export a trip backup after hotels and confirmations are entered."
        }
      ],
      "liveChecks": [
        {
          "id": "glacier-conditions",
          "title": "Glacier current conditions",
          "note": "Road, weather, trail, and park alerts. Going-to-the-Sun Road was fully open when this app was built.",
          "url": "https://www.nps.gov/glac/planyourvisit/conditions.htm",
          "verified": "July 25, 2026"
        },
        {
          "id": "glacier-2026",
          "title": "Glacier 2026 access changes",
          "note": "No vehicle reservation is required in 2026; Logan Pass parking is time-limited and shuttles require reservations.",
          "url": "https://www.nps.gov/glac/planyourvisit/vehicle-reservations2026.htm",
          "verified": "July 25, 2026"
        },
        {
          "id": "piegan-border",
          "title": "Piegan port of entry",
          "note": "Official CBP contact and operating hours. The published daily hours were 7:00 AM to 11:00 PM Mountain Time when checked.",
          "url": "https://www.cbp.gov/contact/ports/piegan-mt",
          "verified": "July 25, 2026"
        },
        {
          "id": "porthill-border",
          "title": "Porthill U.S. port listing",
          "note": "Official U.S. port page. It listed daily hours of 7:00 AM to 7:00 PM Pacific when checked; plan to cross well before evening.",
          "url": "https://www.cbp.gov/about/contact/ports/porthill-id-idaho-3308",
          "verified": "July 25, 2026"
        },
        {
          "id": "rykerts-border",
          "title": "Rykerts Canadian port listing",
          "note": "Official Canadian port page. It listed summer traveller hours of 7:00 AM to 11:00 PM Pacific when checked. Reconfirm because the paired U.S. listing showed an earlier close.",
          "url": "https://do-rb.cbsa-asfc.cloud-nuage.canada.ca/?id=545&lang=en_CA",
          "verified": "July 25, 2026"
        },
        {
          "id": "silverwood-hours",
          "title": "Silverwood 2026 calendar",
          "note": "August 2 was listed as Silverwood 11:00 AM to 9:00 PM and Boulder Beach 11:00 AM to 7:00 PM when checked.",
          "url": "https://www.silverwoodthemepark.com/park/park-hours.php?Month=8&Year=2026",
          "verified": "July 25, 2026"
        },
        {
          "id": "vs-store",
          "title": "Victoria's Secret Spokane Valley",
          "note": "Official store page for the Spokane Valley Mall location.",
          "url": "https://stores.victoriassecret.com/us/wa/spokanevalley/lingerie-736.html",
          "verified": "July 25, 2026"
        },
        {
          "id": "drivebc",
          "title": "DriveBC",
          "note": "BC highway incidents, closures, construction, and webcams.",
          "url": "https://www.drivebc.ca/",
          "verified": "Use live"
        },
        {
          "id": "511-alberta",
          "title": "511 Alberta",
          "note": "Alberta road reports and closures for the first and final legs.",
          "url": "https://511.alberta.ca/",
          "verified": "Use live"
        },
        {
          "id": "montana-511",
          "title": "Montana 511",
          "note": "Montana road conditions, incidents, and construction.",
          "url": "https://www.511mt.net/",
          "verified": "Use live"
        },
        {
          "id": "idaho-511",
          "title": "Idaho 511",
          "note": "Idaho road conditions and construction.",
          "url": "https://511.idaho.gov/",
          "verified": "Use live"
        },
        {
          "id": "washington-511",
          "title": "Washington travel map",
          "note": "Washington road conditions for the Spokane Valley shopping leg.",
          "url": "https://wsdot.com/Travel/Real-time/Map/",
          "verified": "Use live"
        },
        {
          "id": "kootenay-ferry",
          "title": "Kootenay Lake Ferry",
          "note": "Official summer schedule, crossing information, and service notices. The crossing is about 35 minutes; summer queues may add time.",
          "url": "https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/water-travel/inland-ferries/kootenay-lake-ferry",
          "verified": "July 27, 2026"
        },
        {
          "id": "kangaroo-farm",
          "title": "Kangaroo Creek Farm",
          "note": "Farm information and animal list. The trip plan uses the confirmed daily 9:00 AM–3:00 PM operating window; recheck before departure.",
          "url": "https://www.kangaroocreekfarm.com/",
          "verified": "July 27, 2026"
        }
      ]
    }
  ]
};
