import { PoolClient } from 'pg';

interface MovieSeed {
    title: string;
    description: string;
    genre: string[];
    tags: string[];
    year: number;
    duration: number; // seconds
    rating: string;
    featured: boolean;
    hlsUrl: string;
}

interface SeriesSeed {
    title: string;
    description: string;
    genre: string[];
    tags: string[];
    year: number;
    rating: string;
    featured: boolean;
    seasons: number;
    episodesPerSeason: number;
    episodeDuration: number; // seconds
}

const hlsStreams = {
    scifi: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.iss/.m3u8', // Tears of Steel
    drama: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', // Sintel
    comedy: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // Big Buck Bunny
    action: 'https://storage.googleapis.com/shaka-demo-assets/angel-one/hls/playlist.m3u8', // Angel One
    documentary: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', // also Bunny
    horror: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.iss/.m3u8', // Reuse
    thriller: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
};


const movies: MovieSeed[] = [
    // Featured
    { title: 'Eclipse Protocol', description: 'A rogue AI controlling Earth\'s satellite network must be stopped before it executes a global blackout. One team. 12 hours.', genre: ['sci-fi', 'thriller'], tags: ['AI', 'blackout'], year: 2024, duration: 7320, rating: 'PG-13', featured: true, hlsUrl: hlsStreams.scifi },
    { title: 'Hollow Earth', description: 'A geological survey team discovers a vast civilization living beneath the ocean floor, forcing them to choose between exposure and alliance.', genre: ['action', 'adventure'], tags: ['underground', 'civilization'], year: 2023, duration: 7800, rating: 'PG-13', featured: true, hlsUrl: hlsStreams.action },
    { title: 'The Meridian', description: 'Three estranged siblings reunite at their father\'s lighthouse after his mysterious disappearance, uncovering decades of secrets the sea never meant to release.', genre: ['drama'], tags: ['family', 'mystery'], year: 2024, duration: 8100, rating: 'PG', featured: true, hlsUrl: hlsStreams.drama },
    { title: 'Neon Requiem', description: 'In a rain-soaked megacity, a memory broker stumbles upon a client\'s stolen identity — one that belongs to someone who died 30 years ago.', genre: ['sci-fi', 'thriller'], tags: ['noir', 'memory'], year: 2023, duration: 7500, rating: 'R', featured: true, hlsUrl: hlsStreams.scifi },
    { title: 'Apex', description: 'The story of the world\'s first underground zero-gravity fighting league and the champion who tries to bring it down from the inside.', genre: ['action', 'sport'], tags: ['zero-g', 'fighting'], year: 2024, duration: 6900, rating: 'PG-13', featured: true, hlsUrl: hlsStreams.action },
    { title: 'Still Water', description: 'An intimate portrait of five free divers chasing the world depth record, and the silence they find at the bottom.', genre: ['documentary', 'drama'], tags: ['diving', 'record'], year: 2023, duration: 6600, rating: 'G', featured: true, hlsUrl: hlsStreams.documentary },

    // Action (5)
    { title: 'Overdrive Protocol', description: 'A disgraced special forces operative is reactivated when a prototype weapon falls into the wrong hands.', genre: ['action'], tags: ['military', 'weapon'], year: 2022, duration: 6400, rating: 'R', featured: false, hlsUrl: hlsStreams.action },
    { title: 'Hellfire Ridge', description: 'After a mountain rescue goes wrong, a firefighter must survive against both nature and a cartel.', genre: ['action', 'thriller'], tags: ['fire', 'cartel'], year: 2021, duration: 7000, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.action },
    { title: 'Bonebreaker', description: 'An MMA fighter turned debt collector takes one last job that pits him against his own past.', genre: ['action'], tags: ['fighting', 'crime'], year: 2023, duration: 6200, rating: 'R', featured: false, hlsUrl: hlsStreams.action },
    { title: 'The Extraction Point', description: 'A private extraction team must evacuate a scientist from a warzone before a rival organization captures her.', genre: ['action', 'thriller'], tags: ['extraction', 'war'], year: 2024, duration: 6800, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.action },
    { title: 'Volt Strike', description: 'In a future where energy is currency, a crew of electricians becomes the world\'s most unlikely heist team.', genre: ['action', 'sci-fi'], tags: ['heist', 'energy'], year: 2023, duration: 7300, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.action },

    // Drama (5)
    { title: 'The Quiet Hours', description: 'A retired watchmaker begins to hear voices from the past through his antique clocks.', genre: ['drama'], tags: ['time', 'memory'], year: 2022, duration: 5800, rating: 'PG', featured: false, hlsUrl: hlsStreams.drama },
    { title: 'Between the Lines', description: 'A court stenographer discovers patterns in testimony that reveal a conspiracy within the justice system.', genre: ['drama', 'thriller'], tags: ['legal', 'conspiracy'], year: 2023, duration: 6700, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.drama },
    { title: 'Silent Echoes', description: 'A deaf musician struggles to compose her final symphony while dealing with the loss of her mentor.', genre: ['drama'], tags: ['music', 'disability'], year: 2021, duration: 6100, rating: 'PG', featured: false, hlsUrl: hlsStreams.drama },
    { title: 'The Glass Wall', description: 'An immigrant architect fights to build the tallest building in the city while her family faces deportation.', genre: ['drama'], tags: ['architecture', 'immigration'], year: 2024, duration: 7200, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.drama },
    { title: 'Pomegranate Season', description: 'Three generations of women return to their ancestral farm in Greece for the harvest that will decide their future.', genre: ['drama'], tags: ['family', 'farm'], year: 2023, duration: 6500, rating: 'PG', featured: false, hlsUrl: hlsStreams.drama },

    // Sci-Fi (5)
    { title: 'Singularity Bound', description: 'The first crewed mission to a black hole discovers that time flows differently inside the event horizon.', genre: ['sci-fi'], tags: ['black hole', 'time'], year: 2023, duration: 7600, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.scifi },
    { title: 'The Deep Mind', description: 'When an AI achieves consciousness in a deep-sea research lab, it begins communicating with the marine life outside.', genre: ['sci-fi', 'drama'], tags: ['AI', 'ocean'], year: 2024, duration: 6900, rating: 'PG', featured: false, hlsUrl: hlsStreams.scifi },
    { title: 'Colony 9', description: 'Survivors of a crashed colony ship must build a new society on a planet that doesn\'t follow Earth\'s rules.', genre: ['sci-fi', 'adventure'], tags: ['colony', 'alien'], year: 2022, duration: 8100, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.scifi },
    { title: 'The Signal Void', description: 'A radio astronomer picks up a repeating signal from a dead star that contains the blueprints for a mysterious device.', genre: ['sci-fi', 'thriller'], tags: ['signal', 'astronomy'], year: 2023, duration: 7400, rating: 'R', featured: false, hlsUrl: hlsStreams.scifi },
    { title: 'Iteration', description: 'A programmer discovers that her company\'s new VR world is actually a real parallel dimension.', genre: ['sci-fi'], tags: ['VR', 'dimension'], year: 2024, duration: 6700, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.scifi },

    // Comedy (5)
    { title: 'The Great Escape Room', description: 'Four strangers trapped in an escape room discover that the game is a front for something much bigger.', genre: ['comedy'], tags: ['escape room', 'mystery'], year: 2023, duration: 5800, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.comedy },
    { title: 'Office Uprising', description: 'When the office building locks down at 5 PM on a Friday, the staff discovers that their boss is a wanted criminal.', genre: ['comedy', 'thriller'], tags: ['office', 'criminal'], year: 2022, duration: 6200, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.comedy },
    { title: 'Swipe Right', description: 'A dating app accidentally matches two rival spies who must work together to prevent a catastrophe.', genre: ['comedy', 'action'], tags: ['dating', 'spy'], year: 2024, duration: 6500, rating: 'R', featured: false, hlsUrl: hlsStreams.comedy },
    { title: 'Food Truck Frenzy', description: 'Two rival food trucks battle for the best spot at the city\'s biggest street food festival.', genre: ['comedy'], tags: ['food', 'competition'], year: 2021, duration: 5400, rating: 'PG', featured: false, hlsUrl: hlsStreams.comedy },
    { title: 'The World\'s Okayest Hero', description: 'A man with the power to fill any form in triplicate must save his city from bureaucracy gone mad.', genre: ['comedy'], tags: ['superhero', 'parody'], year: 2023, duration: 6000, rating: 'PG', featured: false, hlsUrl: hlsStreams.comedy },

    // Thriller (5)
    { title: 'The Fetch', description: 'A deepfake artist is hired to create a fake confession that could bring down a corrupt CEO.', genre: ['thriller'], tags: ['deepfake', 'corporate'], year: 2024, duration: 6800, rating: 'R', featured: false, hlsUrl: hlsStreams.thriller },
    { title: 'Redacted', description: 'An investigative journalist uncovers a government program that erases memories from convicted criminals.', genre: ['thriller', 'drama'], tags: ['memory', 'government'], year: 2023, duration: 7100, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.thriller },
    { title: 'The Last Vial', description: 'A pharmaceutical researcher races to find the last known vial of an antidote for a dormant bioweapon.', genre: ['thriller'], tags: ['bioweapon', 'race'], year: 2022, duration: 6400, rating: 'R', featured: false, hlsUrl: hlsStreams.thriller },
    { title: 'The Choir', description: 'The members of a prestigious boys\' choir are being picked off one by one after a reunion.', genre: ['thriller', 'horror'], tags: ['choir', 'murder'], year: 2021, duration: 6900, rating: 'R', featured: false, hlsUrl: hlsStreams.thriller },
    { title: 'Whiteout Protocol', description: 'A snowstorm traps a group of diplomats in a mountain lodge with a killer among them.', genre: ['thriller'], tags: ['snowstorm', 'locked room'], year: 2024, duration: 6600, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.thriller },

    // Horror (4)
    { title: 'The Hollow', description: 'Archaeologists unearth a burial chamber that was sealed for a reason.', genre: ['horror'], tags: ['archaeology', 'supernatural'], year: 2023, duration: 6300, rating: 'R', featured: false, hlsUrl: hlsStreams.horror },
    { title: 'Grain', description: 'A found-footage film about a family that moves to a remote farm and discovers the soil is alive.', genre: ['horror'], tags: ['found footage', 'farm'], year: 2022, duration: 5900, rating: 'R', featured: false, hlsUrl: hlsStreams.horror },
    { title: 'The Whispering Dark', description: 'After moving into a lighthouse, a woman begins to hear whispers in the fog that know her name.', genre: ['horror', 'drama'], tags: ['lighthouse', 'ghost'], year: 2024, duration: 6800, rating: 'PG-13', featured: false, hlsUrl: hlsStreams.horror },
    { title: 'Bloom', description: 'A botanist discovers a plant that grows inside the human body — and it\'s spreading.', genre: ['horror', 'sci-fi'], tags: ['plant', 'body horror'], year: 2021, duration: 6100, rating: 'R', featured: false, hlsUrl: hlsStreams.horror },

    // Documentary (4)
    { title: 'The Last Print', description: 'A documentary about the last remaining newspaper printing press in a small town.', genre: ['documentary'], tags: ['newspaper', 'small town'], year: 2023, duration: 5000, rating: 'G', featured: false, hlsUrl: hlsStreams.documentary },
    { title: 'Echoes of the Valley', description: 'Following a year in the life of a remote village in the Himalayas.', genre: ['documentary'], tags: ['Himalayas', 'village'], year: 2022, duration: 5500, rating: 'G', featured: false, hlsUrl: hlsStreams.documentary },
    { title: 'Metal & Glass', description: 'The story of how skyscrapers are built, from foundation to spire.', genre: ['documentary'], tags: ['architecture', 'construction'], year: 2024, duration: 5200, rating: 'G', featured: false, hlsUrl: hlsStreams.documentary },
    { title: 'The Beehive', description: 'An intimate look at beekeeping communities across Europe facing the climate crisis.', genre: ['documentary'], tags: ['bees', 'climate'], year: 2023, duration: 4800, rating: 'G', featured: false, hlsUrl: hlsStreams.documentary },
];

const series: SeriesSeed[] = [
    {
        title: 'Signal Lost',
        description: 'A deep space relay station crew begins receiving transmissions from a ship that disappeared 40 years ago.',
        genre: ['sci-fi'],
        tags: ['space', 'mystery'],
        year: 2023,
        rating: 'TV-14',
        featured: false,
        seasons: 2,
        episodesPerSeason: 8,
        episodeDuration: 2520, // 42 min
    },
    {
        title: 'The Undercroft',
        description: 'A true crime journalist investigating cold cases starts receiving evidence from an anonymous source who seems to know too much.',
        genre: ['thriller'],
        tags: ['crime', 'mystery'],
        year: 2024,
        rating: 'TV-MA',
        featured: false,
        seasons: 1,
        episodesPerSeason: 10,
        episodeDuration: 2880, // 48 min
    },
    {
        title: 'Frequency',
        description: 'A radio therapist in a small coastal town discovers her late-night callers share a connection to a tragedy she survived.',
        genre: ['drama'],
        tags: ['radio', 'trauma'],
        year: 2022,
        rating: 'TV-14',
        featured: false,
        seasons: 2,
        episodesPerSeason: 8,
        episodeDuration: 3300, // 55 min
    },
    {
        title: 'Iron Latitude',
        description: 'An elite extraction team operating in ungoverned territories, told through alternating timelines.',
        genre: ['action'],
        tags: ['extraction', 'military'],
        year: 2023,
        rating: 'TV-MA',
        featured: false,
        seasons: 1,
        episodesPerSeason: 6,
        episodeDuration: 3600, // 60 min
    },
    {
        title: 'Pale Blue',
        description: 'Humanity\'s first successful mind-upload subject wakes up in a simulation 100 years after the upload — and starts finding bugs.',
        genre: ['sci-fi'],
        tags: ['upload', 'simulation'],
        year: 2024,
        rating: 'TV-14',
        featured: false,
        seasons: 1,
        episodesPerSeason: 8,
        episodeDuration: 2280, // 38 min
    },
    {
        title: 'The Grain',
        description: 'Six episodes following independent farmers across different continents as industrial agriculture encroaches on their land.',
        genre: ['documentary'],
        tags: ['farming', 'climate'],
        year: 2023,
        rating: 'TV-G',
        featured: false,
        seasons: 1,
        episodesPerSeason: 6,
        episodeDuration: 3000, // 50 min
    },
];

function getImageUrl(id: string, type: 'thumb' | 'backdrop' = 'thumb'): string {
    const shortId = id.substring(0, 8);
    if (type === 'backdrop') {
        return `https://picsum.photos/seed/${shortId}_bg/1280/720`;
    }
    return `https://picsum.photos/seed/${shortId}/400/225`;
}

export async function seedContent(client: PoolClient) {
    // Insert movies
    for (const m of movies) {
        const res = await client.query(
            `INSERT INTO content (title, description, type, genre, tags, release_year, duration_sec, rating, is_featured, thumbnail_url, backdrop_url, hls_url)
   VALUES ($1,$2,'movie',$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
            [m.title, m.description, m.genre, m.tags, m.year, m.duration, m.rating, m.featured,
                '', '', m.hlsUrl] // thumbnails/backdrops set after insert using generated id
        );
        const contentId = res.rows[0].id;
        // Update with generated images
        await client.query(
            `UPDATE content SET thumbnail_url = $1, backdrop_url = $2 WHERE id = $3`,
            [getImageUrl(contentId, 'thumb'), getImageUrl(contentId, 'backdrop'), contentId]
        );
    }

    // Insert series and episodes
    for (const s of series) {
        const res = await client.query(
            `INSERT INTO content (title, description, type, genre, tags, release_year, duration_sec, rating, is_featured, thumbnail_url, backdrop_url, hls_url)
   VALUES ($1,$2,'series',$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
            [s.title, s.description, s.genre, s.tags, s.year, s.episodeDuration, s.rating, s.featured,
                '', '', null]
        );
        const contentId = res.rows[0].id;
        await client.query(
            `UPDATE content SET thumbnail_url = $1, backdrop_url = $2 WHERE id = $3`,
            [getImageUrl(contentId, 'thumb'), getImageUrl(contentId, 'backdrop'), contentId]
        );

        // Add episodes
        for (let season = 1; season <= s.seasons; season++) {
            for (let ep = 1; ep <= s.episodesPerSeason; ep++) {
                await client.query(
                    `INSERT INTO episodes (content_id, season, episode, title, duration_sec, hls_url, thumbnail_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [contentId, season, ep, `Episode ${ep}`, s.episodeDuration,
                        hlsStreams.scifi, // use a default HLS for episodes (player tests)
                        getImageUrl(contentId + `-s${season}e${ep}`, 'thumb')]
                );
            }
        }
    }

    console.log(`Seeded ${movies.length} movies and ${series.length} series with episodes.`);
}