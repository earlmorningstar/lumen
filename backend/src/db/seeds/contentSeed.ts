import { PoolClient } from 'pg';

const movies = [
    { title: 'Shadow Protocol', description: 'A disavowed agent uncovers a conspiracy that threatens global security.', genre: ['action', 'thriller'], tags: ['spy', 'conspiracy'], year: 2023, duration: 7200, rating: 'PG-13', featured: true },
    { title: 'Neon Dawn', description: 'In a dystopian megacity, a hacker fights to expose a corporate regime.', genre: ['sci-fi', 'action'], tags: ['cyberpunk', 'dystopia'], year: 2024, duration: 6600, rating: 'R', featured: true },
    { title: 'The Last Ember', description: 'A firefighter stranded in a burning skyscraper must rescue survivors while confronting her past.', genre: ['action', 'drama'], tags: ['fire', 'survival'], year: 2022, duration: 6900, rating: 'PG-13' },
    { title: 'Gravity Lost', description: 'Astronauts battle a cascading systems failure on a damaged space station.', genre: ['sci-fi', 'thriller'], tags: ['space', 'survival'], year: 2023, duration: 6800, rating: 'PG-13', featured: true },
    { title: 'Crimson Harvest', description: 'A small-town farmer discovers a dangerous cartel using his land for illicit activities.', genre: ['thriller', 'drama'], tags: ['crime', 'rural'], year: 2021, duration: 6400, rating: 'R' },
    { title: 'Phantom Orchestra', description: 'A blind pianist hears music that reveals a murder plot.', genre: ['drama', 'thriller'], tags: ['music', 'mystery'], year: 2024, duration: 7100, rating: 'PG-13', featured: true },
    { title: 'Beneath the Ice', description: 'Researchers discover ancient life forms trapped in Antarctic ice.', genre: ['sci-fi', 'horror'], tags: ['Antarctica', 'creature'], year: 2023, duration: 6200, rating: 'R' },
    { title: 'Silver Lining Express', description: 'Passengers on a luxury train must work together when an avalanche strands them.', genre: ['drama', 'comedy'], tags: ['train', 'ensemble'], year: 2022, duration: 5800, rating: 'PG' },
    { title: 'Street Kings: Rebellion', description: 'Underground racers challenge a corrupt mayor in a neon-lit metropolis.', genre: ['action', 'sci-fi'], tags: ['racing', 'resistance'], year: 2024, duration: 7000, rating: 'PG-13' },
    { title: 'The Forgotten Garden', description: 'An elderly woman restores a hidden garden, unlocking childhood secrets of a nearby town.', genre: ['drama', 'mystery'], tags: ['garden', 'memory'], year: 2020, duration: 6000, rating: 'G' },
    { title: 'Solar Pulse', description: 'Earth faces a blackout as a massive solar flare hits the atmosphere.', genre: ['sci-fi', 'thriller'], tags: ['space', 'disaster'], year: 2025, duration: 6500, rating: 'PG-13', featured: true },
    { title: 'Echoes of Time', description: 'An archaeologist finds a watch that briefly reverses time.', genre: ['fantasy', 'drama'], tags: ['time-travel', 'history'], year: 2023, duration: 7300, rating: 'PG' },
    { title: 'Velvet Dagger', description: 'A high-stakes jewel heist set in a lavish 1920s masquerade.', genre: ['action', 'crime'], tags: ['heist', 'period'], year: 2022, duration: 6700, rating: 'PG-13' },
    { title: 'Neon Nightmares', description: 'A private investigator hunts rogue AI units in the lower levels of the city.', genre: ['sci-fi', 'mystery'], tags: ['cyberpunk', 'ai'], year: 2024, duration: 7000, rating: 'R' },
    { title: 'Desert Gold', description: 'Adventurers search for a lost city buried under shifting Sahara sands.', genre: ['action', 'adventure'], tags: ['exploration', 'desert'], year: 2021, duration: 7400, rating: 'PG-13' },
    { title: 'The Silent Note', description: 'A composer struggles to write a symphony before losing their hearing.', genre: ['drama', 'music'], tags: ['biopic', 'inspiration'], year: 2025, duration: 6900, rating: 'PG' },
    { title: 'Midnight Protocol', description: 'A tech firm employee discovers a dark secret hidden in the company database.', genre: ['thriller', 'drama'], tags: ['tech', 'conspiracy'], year: 2023, duration: 6600, rating: 'R' },
    { title: 'Coastal Winds', description: 'A family settles into a new life on a remote island.', genre: ['drama', 'romance'], tags: ['family', 'nature'], year: 2022, duration: 6100, rating: 'G' },
    { title: 'Binary Soul', description: 'A robot develops consciousness and seeks its creator.', genre: ['sci-fi', 'drama'], tags: ['ai', 'philosophy'], year: 2024, duration: 6800, rating: 'PG-13' },
    { title: 'Iron Frontier', description: 'Pioneers face harsh terrain while building the first cross-country railway.', genre: ['drama', 'adventure'], tags: ['western', 'history'], year: 2021, duration: 7500, rating: 'PG-13' },
    { title: 'The Glass Maze', description: 'A detective is trapped in a house of mirrors by a serial killer.', genre: ['thriller', 'horror'], tags: ['mystery', 'claustrophobia'], year: 2023, duration: 6400, rating: 'R' },
    { title: 'Skyline Drift', description: 'Drone pilots compete in a dangerous illegal league across rooftops.', genre: ['action', 'sci-fi'], tags: ['drones', 'racing'], year: 2024, duration: 6300, rating: 'PG-13' },
    { title: 'Forest of Whispers', description: 'Travelers stumble upon a village where the trees are said to speak.', genre: ['fantasy', 'adventure'], tags: ['nature', 'folklore'], year: 2022, duration: 6700, rating: 'PG' },
    { title: 'Broken Signals', description: 'A lonely lighthouse keeper intercepts messages from the future.', genre: ['sci-fi', 'drama'], tags: ['time-travel', 'mystery'], year: 2025, duration: 6500, rating: 'PG-13' },
    { title: 'Urban Legend', description: 'A journalist investigates a neighborhood myth that turns out to be real.', genre: ['thriller', 'horror'], tags: ['supernatural', 'investigation'], year: 2023, duration: 6200, rating: 'R' },
    { title: 'The Last Harvest', description: 'In a dying world, a group fights for the last viable crop.', genre: ['sci-fi', 'drama'], tags: ['dystopia', 'survival'], year: 2022, duration: 7200, rating: 'R' },
    { title: 'Cold Fusion', description: 'Scientists race to perfect clean energy amidst political sabotage.', genre: ['thriller', 'drama'], tags: ['science', 'politics'], year: 2024, duration: 6900, rating: 'PG-13' },
    { title: 'Stellar Drift', description: 'A stranded pilot navigates a nebula using makeshift equipment.', genre: ['sci-fi', 'adventure'], tags: ['space', 'survival'], year: 2023, duration: 6800, rating: 'PG-13' },
    { title: 'Underground', description: 'A rebel group plans to overthrow a corrupt government from the sewers.', genre: ['action', 'drama'], tags: ['war', 'resistance'], year: 2021, duration: 7100, rating: 'R' },
    { title: 'Mountain Echo', description: 'A climber searches for their missing brother in the Alps.', genre: ['drama', 'thriller'], tags: ['mountains', 'survival'], year: 2022, duration: 6400, rating: 'PG-13' },
    { title: 'Neon Shadows', description: 'A detective roams a neon city seeking a vanished informant.', genre: ['crime', 'thriller'], tags: ['noir', 'cyberpunk'], year: 2024, duration: 7000, rating: 'R' },
    { title: 'Wild Heart', description: 'A veterinarian discovers a hidden animal sanctuary in the jungle.', genre: ['drama', 'adventure'], tags: ['nature', 'wildlife'], year: 2020, duration: 6600, rating: 'G' },
    { title: 'Deep Sea Core', description: 'A submarine team discovers a glowing cavern on the ocean floor.', genre: ['sci-fi', 'horror'], tags: ['ocean', 'mystery'], year: 2023, duration: 6800, rating: 'R' },
    { title: 'Midnight Waltz', description: 'Two strangers find love through dance in a ballroom competition.', genre: ['romance', 'drama'], tags: ['dance', 'music'], year: 2022, duration: 6200, rating: 'PG' },
    { title: 'Ghost of the Grid', description: 'A gamer finds a hidden level that controls real-world events.', genre: ['sci-fi', 'thriller'], tags: ['gaming', 'mystery'], year: 2025, duration: 6700, rating: 'PG-13' },
    { title: 'Crimson Tide', description: 'A naval captain faces an impossible choice during a diplomatic crisis.', genre: ['action', 'thriller'], tags: ['navy', 'war'], year: 2021, duration: 7400, rating: 'R' },
    { title: 'The Architect', description: 'An urban planner battles to build a utopian district.', genre: ['drama', 'sci-fi'], tags: ['architecture', 'city'], year: 2023, duration: 6900, rating: 'PG' },
    { title: 'Silver Key', description: 'A young girl inherits a key that unlocks her family history.', genre: ['fantasy', 'mystery'], tags: ['magic', 'family'], year: 2022, duration: 6300, rating: 'PG' },
    { title: 'Apex Predator', description: 'A wildlife documentary crew becomes the hunted in a remote valley.', genre: ['horror', 'thriller'], tags: ['nature', 'survival'], year: 2024, duration: 6500, rating: 'R' },
    { title: 'Paper Planes', description: 'Two best friends travel the world to find their childhood home.', genre: ['drama', 'adventure'], tags: ['friendship', 'travel'], year: 2021, duration: 6600, rating: 'G' },
    { title: 'The Watcher', description: 'A security guard discovers he can see through the eyes of others.', genre: ['sci-fi', 'drama'], tags: ['supernatural', 'privacy'], year: 2023, duration: 6800, rating: 'PG-13' },
    { title: 'Red Earth', description: 'Colonists on Mars face a lethal dust storm.', genre: ['sci-fi', 'survival'], tags: ['mars', 'space'], year: 2025, duration: 7200, rating: 'PG-13' },
    { title: 'Blue Horizon', description: 'A sailing captain crosses the Atlantic in a record-breaking challenge.', genre: ['drama', 'adventure'], tags: ['sea', 'sailing'], year: 2022, duration: 6400, rating: 'PG' },
    { title: 'Circuit Breaker', description: 'A hacker shuts down a city to save the person they love.', genre: ['action', 'thriller'], tags: ['tech', 'crime'], year: 2024, duration: 6900, rating: 'R' },
    { title: 'The Old Oak', description: 'Generations of a family gather at a century-old farm.', genre: ['drama'], tags: ['family', 'history'], year: 2020, duration: 7000, rating: 'PG' },
    { title: 'Neon Pulse', description: 'A street dancer struggles for fame in a high-stakes competition.', genre: ['drama', 'music'], tags: ['dance', 'city'], year: 2023, duration: 6600, rating: 'PG-13' },
    { title: 'Tidal Shift', description: 'Scientists track a massive underwater movement threatening the coast.', genre: ['thriller', 'sci-fi'], tags: ['ocean', 'disaster'], year: 2024, duration: 6700, rating: 'PG-13' },
    { title: 'Whisper of Steel', description: 'A master swordsman lives in hiding until they are needed once more.', genre: ['action', 'adventure'], tags: ['fantasy', 'sword'], year: 2022, duration: 7300, rating: 'R' },
    { title: 'Virtual Eden', description: 'A luxury resort exists entirely within a digital simulation.', genre: ['sci-fi', 'thriller'], tags: ['virtual-reality', 'luxury'], year: 2025, duration: 6800, rating: 'R' },
    { title: 'The Bridge', description: 'Two sides of a war meet on a neutral ground bridge.', genre: ['drama', 'war'], tags: ['peace', 'history'], year: 2021, duration: 7100, rating: 'PG-13' },
    { title: 'Sunken Treasure', description: 'Divers risk everything for a legendary wreck.', genre: ['adventure', 'thriller'], tags: ['ocean', 'gold'], year: 2023, duration: 6500, rating: 'PG-13' },
    { title: 'Echo Valley', description: 'A mystery unfolds when a strange sound plagues a small town.', genre: ['drama', 'mystery'], tags: ['supernatural', 'small-town'], year: 2022, duration: 6200, rating: 'PG-13' },
    { title: 'Iron Will', description: 'An underdog boxer fights for the world championship.', genre: ['drama', 'sport'], tags: ['boxing', 'fight'], year: 2024, duration: 7000, rating: 'R' },
    { title: 'Cloud City', description: 'A high-altitude metropolis faces structural collapse.', genre: ['sci-fi', 'thriller'], tags: ['dystopia', 'survival'], year: 2023, duration: 6900, rating: 'PG-13' },
    { title: 'The Last Note', description: 'An aging rocker tries to record one last hit.', genre: ['drama', 'music'], tags: ['rock', 'legacy'], year: 2021, duration: 6600, rating: 'PG' },
    { title: 'Frozen Heart', description: 'A researcher studies ice samples but finds something alive.', genre: ['horror', 'sci-fi'], tags: ['creature', 'science'], year: 2025, duration: 6400, rating: 'R' },
    { title: 'City of Gold', description: 'A group of friends discovers a tunnel system leading to buried loot.', genre: ['adventure', 'comedy'], tags: ['treasure', 'friends'], year: 2022, duration: 6800, rating: 'PG' },
    { title: 'Storm Chase', description: 'Meteorologists race to catch the biggest storm in history.', genre: ['action', 'thriller'], tags: ['weather', 'science'], year: 2024, duration: 6700, rating: 'PG-13' },
    { title: 'The Library', description: 'A librarian finds books that write their own stories.', genre: ['fantasy', 'mystery'], tags: ['books', 'magic'], year: 2023, duration: 6300, rating: 'G' },
    { title: 'Final Stand', description: 'Soldiers defend a final outpost against overwhelming odds.', genre: ['action', 'war'], tags: ['battle', 'soldier'], year: 2024, duration: 7200, rating: 'R' }
];

const series = [
    { title: 'Crimson Tides', description: 'A fishing village harbors dark secrets when an outsider arrives.', genre: ['drama', 'thriller'], tags: ['mystery', 'small town'], year: 2022, episodes: 8, episodeDuration: 3000, rating: 'TV-MA', featured: true },
    { title: 'Quantum Drift', description: 'A crew of scavengers discovers a parallel dimension inside a derelict starship.', genre: ['sci-fi'], tags: ['space', 'exploration'], year: 2023, episodes: 10, episodeDuration: 2700, rating: 'TV-14' },
    { title: 'Laugh Factory', description: 'A struggling comedy club becomes the hot spot for bizarre characters.', genre: ['comedy'], tags: ['stand-up', 'friendship'], year: 2024, episodes: 12, episodeDuration: 1500, rating: 'TV-14' },
    { title: 'The Iron Dynasty', description: 'A historical epic following a warrior family’s rise in feudal Japan.', genre: ['drama', 'action'], tags: ['samurai', 'historical'], year: 2021, episodes: 8, episodeDuration: 3300, rating: 'TV-MA' },
    { title: 'Data Breach', description: 'Cybersecurity analysts race to stop a global digital weapon.', genre: ['thriller', 'sci-fi'], tags: ['hacking', 'conspiracy'], year: 2023, episodes: 6, episodeDuration: 2800, rating: 'TV-14', featured: true },
    { title: 'Neon Pulse', description: 'Detectives in a neon-drenched future hunt rogue androids.', genre: ['sci-fi', 'action'], tags: ['cyberpunk', 'police'], year: 2024, episodes: 10, episodeDuration: 2600, rating: 'TV-MA', featured: true },
    { title: 'Alpine Secrets', description: 'A remote village in the Alps hides a decades-old mystery.', genre: ['mystery', 'drama'], tags: ['cold', 'secrets'], year: 2022, episodes: 6, episodeDuration: 3000, rating: 'TV-14' },
    { title: 'Chef’s Table Talk', description: 'Renowned chefs discuss the art of cooking while competing for a Michelin star.', genre: ['documentary', 'lifestyle'], tags: ['food', 'competition'], year: 2025, episodes: 10, episodeDuration: 2400, rating: 'TV-G' },
    { title: 'Broken Compass', description: 'A group of friends shipwrecked on a mysterious island must find their way back.', genre: ['adventure', 'drama'], tags: ['survival', 'island'], year: 2021, episodes: 12, episodeDuration: 2700, rating: 'TV-14' },
    { title: 'Shadow Syndicate', description: 'A group of elite thieves plan the perfect heist across Europe.', genre: ['action', 'crime'], tags: ['heist', 'spy'], year: 2023, episodes: 8, episodeDuration: 3200, rating: 'TV-MA', featured: true },
    { title: 'Botanist Chronicles', description: 'A scientist discovers plants that can communicate with humans.', genre: ['sci-fi', 'drama'], tags: ['nature', 'science'], year: 2024, episodes: 8, episodeDuration: 2800, rating: 'TV-PG' },
    { title: 'Midnight Gazette', description: 'A small-town newspaper uncovers corruption in the city government.', genre: ['drama', 'thriller'], tags: ['journalism', 'politics'], year: 2022, episodes: 10, episodeDuration: 2900, rating: 'TV-14' },
    { title: 'The Last Frontier', description: 'Settlers on a new planet struggle to maintain their colony.', genre: ['sci-fi', 'adventure'], tags: ['space', 'colony'], year: 2025, episodes: 10, episodeDuration: 3000, rating: 'TV-14' },
    { title: 'Waltz of Time', description: 'A dance school follows the lives of students reaching for stardom.', genre: ['drama', 'music'], tags: ['dance', 'ambition'], year: 2023, episodes: 12, episodeDuration: 2500, rating: 'TV-PG' },
    { title: 'Echo Valley', description: 'Supernatural events haunt a quiet suburban town.', genre: ['horror', 'mystery'], tags: ['ghost', 'supernatural'], year: 2024, episodes: 8, episodeDuration: 2600, rating: 'TV-MA' },
    { title: 'Street Racing Kings', description: 'Underground racers navigate the high-stakes world of illegal street circuits.', genre: ['action'], tags: ['cars', 'racing'], year: 2023, episodes: 8, episodeDuration: 2500, rating: 'TV-14' },
    { title: 'Ancient Echoes', description: 'Archeologists uncover a civilization that lived beneath the earth.', genre: ['adventure', 'fantasy'], tags: ['ancient', 'lost-city'], year: 2022, episodes: 6, episodeDuration: 3100, rating: 'TV-PG' },
    { title: 'The Silicon Age', description: 'The rise and fall of tech companies in Silicon Valley.', genre: ['drama', 'biopic'], tags: ['tech', 'business'], year: 2024, episodes: 8, episodeDuration: 2900, rating: 'TV-14' },
    { title: 'Kingdoms Divided', description: 'Two royal families fight for control of a fractured continent.', genre: ['fantasy', 'drama'], tags: ['war', 'royalty'], year: 2021, episodes: 10, episodeDuration: 3500, rating: 'TV-MA', featured: true },
    { title: 'Code Red', description: 'Hospital staff deal with life-and-death situations in the ER.', genre: ['drama', 'medical'], tags: ['doctor', 'emergency'], year: 2025, episodes: 14, episodeDuration: 2700, rating: 'TV-14' },
    { title: 'Ocean’s Depths', description: 'A deep-sea research team finds a sunken city.', genre: ['sci-fi', 'thriller'], tags: ['ocean', 'underwater'], year: 2023, episodes: 8, episodeDuration: 3000, rating: 'TV-14' },
    { title: 'Comic Relief', description: 'An animated comedy about a dysfunctional office in space.', genre: ['comedy', 'animation'], tags: ['space', 'office'], year: 2024, episodes: 12, episodeDuration: 1200, rating: 'TV-14' },
    { title: 'The Silent Witness', description: 'A forensic pathologist solves crimes through the evidence left behind.', genre: ['crime', 'thriller'], tags: ['forensics', 'investigation'], year: 2022, episodes: 10, episodeDuration: 2800, rating: 'TV-MA' },
    { title: 'Wild Kingdom', description: 'Conservationists fight to protect an endangered species.', genre: ['documentary', 'drama'], tags: ['nature', 'wildlife'], year: 2023, episodes: 6, episodeDuration: 2400, rating: 'TV-G' },
    { title: 'Binary Dreams', description: 'A simulation of a utopia goes wrong for its inhabitants.', genre: ['sci-fi', 'thriller'], tags: ['ai', 'virtual-reality'], year: 2025, episodes: 8, episodeDuration: 2700, rating: 'TV-14' },
    { title: 'Mountain Rescue', description: 'A team of experts responds to mountain emergencies.', genre: ['action', 'drama'], tags: ['mountains', 'survival'], year: 2022, episodes: 10, episodeDuration: 2600, rating: 'TV-14' },
    { title: 'Midnight Jazz', description: 'Follow the lives of musicians in a 1950s New Orleans club.', genre: ['drama', 'music'], tags: ['jazz', 'period'], year: 2021, episodes: 8, episodeDuration: 3000, rating: 'TV-MA' },
    { title: 'Project Aurora', description: 'A secret government facility experiments with light-speed travel.', genre: ['sci-fi', 'thriller'], tags: ['science', 'conspiracy'], year: 2024, episodes: 8, episodeDuration: 2900, rating: 'TV-14' },
    { title: 'The Last Baker', description: 'A family bakery tries to survive in a rapidly gentrifying city.', genre: ['drama', 'comedy'], tags: ['food', 'family'], year: 2023, episodes: 10, episodeDuration: 2200, rating: 'TV-PG' },
    { title: 'Cyber War', description: 'Nations engage in a full-scale digital war for dominance.', genre: ['thriller', 'action'], tags: ['hacking', 'war'], year: 2025, episodes: 6, episodeDuration: 3000, rating: 'TV-MA' },
    { title: 'The Lost Library', description: 'An adventurer finds a library containing lost knowledge.', genre: ['fantasy', 'adventure'], tags: ['books', 'magic'], year: 2024, episodes: 8, episodeDuration: 2800, rating: 'TV-PG' },
    { title: 'High Stakes', description: 'A high-end poker tournament turns into a deadly game.', genre: ['drama', 'thriller'], tags: ['poker', 'gambling'], year: 2022, episodes: 8, episodeDuration: 2700, rating: 'TV-MA' },
    { title: 'Urban Jungle', description: 'An investigative report on the hidden lives of city animals.', genre: ['documentary'], tags: ['city', 'nature'], year: 2023, episodes: 5, episodeDuration: 2400, rating: 'TV-G' },
    { title: 'The Architect', description: 'A brilliant mind builds structures that defy the laws of physics.', genre: ['sci-fi', 'drama'], tags: ['architecture', 'science'], year: 2024, episodes: 10, episodeDuration: 2900, rating: 'TV-14' },
    { title: 'Railway Dreams', description: 'Travelers from different walks of life on a cross-country train.', genre: ['drama', 'romance'], tags: ['train', 'journey'], year: 2021, episodes: 6, episodeDuration: 2600, rating: 'TV-PG' },
    { title: 'Forgotten Heroes', description: 'Stories of unknown soldiers who changed the course of history.', genre: ['documentary', 'history'], tags: ['war', 'history'], year: 2023, episodes: 8, episodeDuration: 3000, rating: 'TV-14' },
    { title: 'Stellar Pilots', description: 'Cadets train to become the first human explorers in deep space.', genre: ['sci-fi', 'action'], tags: ['space', 'training'], year: 2025, episodes: 12, episodeDuration: 2800, rating: 'TV-14' },
    { title: 'The Masterpiece', description: 'An artist struggles to paint the greatest portrait of the century.', genre: ['drama', 'biopic'], tags: ['art', 'inspiration'], year: 2022, episodes: 8, episodeDuration: 2700, rating: 'TV-PG' },
    { title: 'Island Survival', description: 'Contestants are left on a deserted island to survive.', genre: ['reality', 'adventure'], tags: ['competition', 'survival'], year: 2024, episodes: 16, episodeDuration: 2500, rating: 'TV-14' },
    { title: 'Dark Matter', description: 'Physicists discover a substance that alters reality.', genre: ['sci-fi', 'mystery'], tags: ['science', 'reality'], year: 2023, episodes: 8, episodeDuration: 2900, rating: 'TV-MA' },
    { title: 'Neon Nights', description: 'A taxi driver encounters strange passengers in a futuristic city.', genre: ['thriller', 'drama'], tags: ['cyberpunk', 'mystery'], year: 2025, episodes: 10, episodeDuration: 2600, rating: 'TV-MA' },
    { title: 'The Garden', description: 'A community builds a garden in a desolate urban neighborhood.', genre: ['drama', 'comedy'], tags: ['community', 'nature'], year: 2022, episodes: 8, episodeDuration: 2200, rating: 'TV-G' },
    { title: 'Tidal Waves', description: 'A coastal town prepares for a massive tsunami.', genre: ['drama', 'thriller'], tags: ['disaster', 'nature'], year: 2024, episodes: 6, episodeDuration: 3000, rating: 'TV-14' },
    { title: 'Vintage Vibes', description: 'A fashion designer finds inspiration in the 1920s.', genre: ['drama', 'lifestyle'], tags: ['fashion', 'period'], year: 2023, episodes: 8, episodeDuration: 2500, rating: 'TV-PG' },
    { title: 'The Code Breakers', description: 'Mathematicians race to break an enemy code during wartime.', genre: ['drama', 'history'], tags: ['math', 'war'], year: 2021, episodes: 6, episodeDuration: 3100, rating: 'TV-14' },
    { title: 'Space Salvage', description: 'Workers clean up debris from broken satellites in orbit.', genre: ['sci-fi', 'comedy'], tags: ['space', 'work'], year: 2024, episodes: 10, episodeDuration: 2000, rating: 'TV-PG' },
    { title: 'The Silent Sea', description: 'A submarine crew encounters unexplained phenomena.', genre: ['thriller', 'sci-fi'], tags: ['underwater', 'mystery'], year: 2023, episodes: 8, episodeDuration: 2800, rating: 'TV-14' },
    { title: 'Wild Roots', description: 'A family moves to a remote homestead to live off the land.', genre: ['drama', 'documentary'], tags: ['nature', 'homestead'], year: 2025, episodes: 12, episodeDuration: 2400, rating: 'TV-PG' },
    { title: 'The Grand Race', description: 'Cyclists compete in an around-the-world race.', genre: ['sports', 'drama'], tags: ['cycling', 'competition'], year: 2022, episodes: 10, episodeDuration: 2700, rating: 'TV-14' },
    { title: 'Mirror Image', description: 'A detective realizes their killer is a version of themselves.', genre: ['mystery', 'thriller'], tags: ['doppelganger', 'crime'], year: 2024, episodes: 8, episodeDuration: 3000, rating: 'TV-MA' },
    { title: 'Sky High', description: 'Pilots operate a luxury flying cruise ship.', genre: ['adventure', 'drama'], tags: ['aviation', 'luxury'], year: 2023, episodes: 8, episodeDuration: 2900, rating: 'TV-14' },
    { title: 'The Last Song', description: 'A band struggles to record their final album.', genre: ['drama', 'music'], tags: ['rock', 'friendship'], year: 2021, episodes: 6, episodeDuration: 2500, rating: 'TV-PG' },
    { title: 'Desert Storm', description: 'Soldiers defend a lonely outpost in the desert.', genre: ['action', 'drama'], tags: ['war', 'desert'], year: 2024, episodes: 8, episodeDuration: 3200, rating: 'TV-MA' },
    { title: 'Hidden Treasures', description: 'Antique hunters search for lost historical items.', genre: ['reality', 'adventure'], tags: ['history', 'collection'], year: 2025, episodes: 12, episodeDuration: 2300, rating: 'TV-PG' },
    { title: 'Cyber Life', description: 'A family adopts a humanoid robot.', genre: ['sci-fi', 'comedy'], tags: ['robot', 'family'], year: 2023, episodes: 10, episodeDuration: 2100, rating: 'TV-PG' },
    { title: 'Deep Woods', description: 'A group gets lost while hiking in a haunted forest.', genre: ['horror', 'thriller'], tags: ['nature', 'supernatural'], year: 2022, episodes: 6, episodeDuration: 2700, rating: 'TV-MA' },
    { title: 'Art of War', description: 'Historical analysis of famous battles.', genre: ['documentary', 'history'], tags: ['military', 'war'], year: 2024, episodes: 10, episodeDuration: 2800, rating: 'TV-14' },
    { title: 'Final Frontier', description: 'The history of space exploration.', genre: ['documentary'], tags: ['space', 'science'], year: 2023, episodes: 8, episodeDuration: 3000, rating: 'TV-G' },
    { title: 'City Lights', description: 'Nighttime life in a major metropolis.', genre: ['drama'], tags: ['city', 'life'], year: 2025, episodes: 10, episodeDuration: 2600, rating: 'TV-14' },
    { title: 'The Bridge', description: 'Engineers build a bridge connecting two continents.', genre: ['drama', 'documentary'], tags: ['engineering', 'global'], year: 2021, episodes: 6, episodeDuration: 3000, rating: 'TV-PG' }
];

export async function seedContent(client: PoolClient) {
    for (const m of movies) {
        await client.query(
            `INSERT INTO content (title, description, type, genre, tags, release_year, duration_sec, rating, is_featured, thumbnail_url, backdrop_url, hls_url)
       VALUES ($1,$2,'movie',$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [m.title, m.description, m.genre, m.tags, m.year, m.duration, m.rating, m.featured ?? false,
            `https://picsum.photos/seed/${m.title.replace(/\s/g, '')}/400/225`,
            `https://picsum.photos/seed/${m.title.replace(/\s/g, '')}bg/1280/720`,
                'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8']
        );
    }
    for (const s of series) {
        const res = await client.query(
            `INSERT INTO content (title, description, type, genre, tags, release_year, duration_sec, rating, is_featured, thumbnail_url, backdrop_url, hls_url)
       VALUES ($1,$2,'series',$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
            [s.title, s.description, s.genre, s.tags, s.year, s.episodeDuration, s.rating, s.featured ?? false,
            `https://picsum.photos/seed/${s.title.replace(/\s/g, '')}/400/225`,
            `https://picsum.photos/seed/${s.title.replace(/\s/g, '')}bg/1280/720`,
                null]
        );
        const contentId = res.rows[0].id;
        for (let i = 1; i <= s.episodes; i++) {
            await client.query(
                `INSERT INTO episodes (content_id, season, episode, title, duration_sec, hls_url, thumbnail_url)
         VALUES ($1, 1, $2, $3, $4, $5, $6)`,
                [contentId, i, `Episode ${i}`, s.episodeDuration, 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                    `https://picsum.photos/seed/${s.title.replace(/\s/g, '')}ep${i}/400/225`]
            );
        }
    }
    console.log(`Seeded ${movies.length} movies and ${series.length} series.`);
}