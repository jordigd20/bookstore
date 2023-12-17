import * as bcrypt from 'bcrypt';
type Role = 'ADMIN' | 'USER';

export interface MockUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
  customerId: string;
  addresses?: { create: any } | { createMany: any };
  wishlist?: string[];
  cart?: string[];
  orders?: { slug: string; quantity: number; price: number }[];
  ratings?: { slug: string; rating: number }[];
}

export const categories = [
  {
    slug: 'fiction-literature',
    name: 'Fiction & Literature',
    thumbnail:
      'https://images.unsplash.com/photo-1487035242901-d419a42d17af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=727&q=80'
  },
  {
    slug: 'science-fiction',
    name: 'Science Fiction',
    thumbnail:
      'https://images.unsplash.com/photo-1487035242901-d419a42d17af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=727&q=80'
  },
  {
    slug: 'mistery-thrillers',
    name: 'Mistery & thrillers',
    thumbnail:
      'https://images.unsplash.com/photo-1487035242901-d419a42d17af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=727&q=80'
  },
  {
    slug: 'romance',
    name: 'Romance',
    thumbnail:
      'https://images.unsplash.com/photo-1487035242901-d419a42d17af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=727&q=80'
  },
  { slug: 'fantasy', name: 'Fantasy' },
  { slug: 'health-fitness', name: 'Health & Fitness' },
  { slug: 'self-help', name: 'Self-Help' },
  { slug: 'horror-tales', name: 'Horror tales' },
  { slug: 'biography-autobiography', name: 'Biography & Autobiography' },
  { slug: 'humor', name: 'Humor' },
  { slug: 'art', name: 'Art' }
];

export const books = [
  {
    title: 'The Lord of the Rings',
    ISBN: '9780261103252',
    slug: 'the-lord-of-the-rings',
    author: 'J.R.R. Tolkien',
    publisher: 'George Allen & Unwin',
    publishedDate: new Date(1954, 7, 29),
    description:
      'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.',
    pageCount: 1178,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/guxmkzgn8j786sp1a3ui.webp',
    language: 'ES',
    currentPrice: 19.99,
    originalPrice: 24.99,
    discount: 20,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Harry Potter and the Philosopher Stone',
    ISBN: '9780261103253',
    slug: 'harry-potter-and-the-philosopher-stone',
    author: 'J.K Rowling',
    publisher: 'George Allen & Unwin',
    publishedDate: new Date(1954, 6, 29),
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!",
    pageCount: 309,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/q10k25tm0cwvozth6nyl.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    ISBN: '9781781100509',
    slug: 'harry-potter-and-the-chamber-of-secrets',
    author: 'J.K. Rowling',
    publisher: 'Pottermore Publishing',
    publishedDate: new Date(2015, 11, 8),
    description:
      "Harry Potter's summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby, and rescue from the Dursleys by his friend Ron Weasley in a magical flying car! Back at Hogwarts School of Witchcraft and Wizardry for his second year, Harry hears strange whispers echo through empty corridors - and then the attacks start. Students are found as though turned to stone... Dobby's sinister predictions seem to be coming true.",
    pageCount: 341,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/cbz9rm95puryzg9wbv1c.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Game of Thrones: A Song of Ice and Fire',
    ISBN: '9780007378425',
    slug: 'a-song-of-ice-and-fire',
    author: 'George R.R. Martin',
    publisher: 'HarperVoyager',
    publishedDate: new Date(2014, 10, 28),
    description:
      "HBO's hit series A GAME OF THRONES is based on George R. R. Martin's internationally bestselling series A SONG OF ICE AND FIRE, the greatest fantasy epic of the modern age. A GAME OF THRONES is the first volume in the series.",
    pageCount: 1515,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/um8ofdbkvryx2pxoihdx.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Hobbit',
    ISBN: '9780008376109',
    slug: 'the-hobbit',
    author: 'J.R.R. Tolkien',
    publisher: 'Houghton Mifflin',
    publishedDate: new Date(2002, 7, 15),
    description:
      'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure. They have launched a plot to raid the treasure hoard guarded by Smaug the Magnificent, a large and very dangerous dragon. Bilbo reluctantly joins their quest, unaware that on his journey to the Lonely Mountain he will encounter both a magic ring and a frightening creature known as Gollum...',
    pageCount: 366,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/qrkf3ghjnzrrpa35btm5.webp',
    language: 'EN',
    currentPrice: 11.99,
    originalPrice: 11.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe',
    ISBN: '9780007115617',
    slug: 'the-lion-the-witch-and-the-wardrobe',
    author: 'C.S. Lewis',
    publisher: 'HarperCollins',
    publishedDate: new Date(2009, 9, 16),
    description:
      "The Lion, the Witch and the Wardrobe is the second book in C. S. Lewis's The Chronicles of Narnia, a series that has become part of the canon of classic literature, drawing readers of all ages into a magical land with unforgettable characters for over fifty years.",
    pageCount: 224,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/f36oruwafbqzrbjqnske.webp',
    language: 'EN',
    currentPrice: 6.49,
    originalPrice: 1.99,
    discount: 69,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Mistborn: The Final Empire',
    ISBN: '9780765350381',
    slug: 'mistborn-the-final-empire',
    author: 'Brandon Sanderson',
    publisher: 'Macmillan',
    publishedDate: new Date(2010, 3, 17),
    description:
      'For a thousand years the ash fell and no flowers bloomed. For a thousand years the Skaa slaved in misery and lived in fear. For a thousand years the Lord Ruler, the "Sliver of Infinity," reigned with absolute power and ultimate terror, divinely invincible. Then, when hope was so long lost that not even its memory remained, a terribly scarred, heart-broken half-Skaa rediscovered it in the depths of the',
    pageCount: 544,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/cdzuiqdgxq3rnve5c2nk.webp',
    language: 'EN',
    currentPrice: 7.99,
    originalPrice: 7.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Name of the Wind',
    ISBN: '9781101147160',
    slug: 'the-name-of-the-wind',
    author: 'Patrick Rothfuss',
    publisher: 'Astra Publishing House',
    publishedDate: new Date(2007, 2, 27),
    description:
      'The Name of the Wind is a fantasy novel by Patrick Rothfuss, the first book in the series The Kingkiller Chronicle.',
    pageCount: 736,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/x3msnhbdrvxixru7mvcx.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Lies of Locke Lamora',
    ISBN: '9780553588941',
    slug: 'the-lies-of-locke-lamora',
    author: 'Scott Lynch',
    publisher: 'Bantam Spectra',
    publishedDate: new Date(2006, 6, 27),
    description:
      "An orphan's life is harsh—and often short—in the mysterious island city of Camorr. But young Locke Lamora dodges death and slavery, becoming a thief under the tutelage of a gifted con artist. As leader of the band of light-fingered brothers known as the Gentleman Bastards, Locke is soon infamous, fooling even the underworld's most feared ruler. But in the shadows lurks someone still more ambitious and deadly. Faced with a bloody coup that threatens to destroy everyone and everything that holds meaning in his mercenary life, Locke vows to beat the enemy at his own brutal game—or die trying.",
    pageCount: 512,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/j7vjpyauk4uqwl1vvdud.webp',
    language: 'EN',
    currentPrice: 3.99,
    originalPrice: 9.99,
    discount: 60,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Way of Kings',
    ISBN: '9781429992800',
    slug: 'the-way-of-kings',
    author: 'Brandon Sanderson',
    publisher: 'Tor Books',
    publishedDate: new Date(2010, 7, 31),
    description:
      'From #1 New York Times bestselling author Brandon Sanderson, The Way of Kings, Book One of the Stormlight Archive begins an incredible new saga of epic proportion.',
    pageCount: 1008,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/d3ncu5ia7wcho80f2tll.webp',
    language: 'EN',
    currentPrice: 7.99,
    originalPrice: 7.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'His Dark Materials: Northern Lights',
    ISBN: '9780440418603',
    slug: 'northern-lights',
    author: 'Philip Pullman',
    publisher: 'Alfred A. Knopf, Inc.',
    publishedDate: new Date(2001, 10, 13),
    description:
      'Northern Lights is a fantasy novel by Philip Pullman, published by Scholastic UK in 1995. It is the first book of the His Dark Materials trilogy.',
    pageCount: 432,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/v1xate42c351f4r5cdee.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 8.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: "The Wise Man's Fear",
    ISBN: '9781101486405',
    slug: 'the-wise-mans-fear',
    author: 'Patrick Rothfuss',
    publisher: 'DAW Books',
    publishedDate: new Date(2011, 2, 1),
    description:
      "Discover book two of Patrick Rothfuss' #1 New York Times-bestselling epic fantasy series, The Kingkiller Chronicle.",
    pageCount: 1120,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/rpaceoji7s8zfmslgb5j.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Elantris',
    ISBN: '9781429914550',
    slug: 'elantris',
    author: 'Brandon Sanderson',
    publisher: 'Macmillan',
    publishedDate: new Date(2007, 4, 1),
    description:
      'In 2005, Brandon Sanderson debuted with Elantris, an epic fantasy unlike any other then on the market. To celebrate its tenth anniversary, Tor is reissuing Elantris in a special edition, a fresh chance to introduce it to the myriad readers who have since become Sanderson fans.',
    pageCount: 496,
    imageLink: 'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697809645/books/x3b5roaztedulwuayfcl.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Blade Itself',
    ISBN: '9780316387330',
    slug: 'the-blade-itself',
    author: 'Joe Abercrombie',
    publisher: 'Orbit',
    publishedDate: new Date(2015, 9, 8),
    description:
      'The Blade Itself is a fantasy novel by Joe Abercrombie. It is the first book in The First Law trilogy and follows the lives of several characters in a world on the brink of war.',
    pageCount: 560,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/dwmb5qffp7bblpcb5rx7.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Black Prism',
    ISBN: '9780316087544',
    slug: 'the-black-prism',
    author: 'Brent Weeks',
    publisher: 'Orbit Books',
    publishedDate: new Date(2010, 8, 25),
    description:
      'The Black Prism is a fantasy novel by Brent Weeks. It is the first book in the five-volume Lightbringer Series and follows the story of a world where magic is controlled through the use of different colors of light.',
    pageCount: 640,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/pxpzos041e0drhryiame.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: "The Magician's Guild",
    ISBN: '9780061797675',
    slug: 'the-magicians-guild',
    author: 'Trudi Canavan',
    publisher: 'HarperCollins',
    publishedDate: new Date(2001, 2, 1),
    description:
      "The Magician's Guild is a fantasy novel by Trudi Canavan. It is the first book in The Black Magician Trilogy and tells the story of a young girl who discovers her magical abilities and enters a world of intrigue and power.",
    pageCount: 384,
    imageLink: 'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697808710/books/ebg1jkrhmlpfktdc4web.webp',
    language: 'EN',
    currentPrice: 8.49,
    originalPrice: 8.49,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Way of Shadows',
    ISBN: '9780316040228',
    slug: 'the-way-of-shadows',
    author: 'Brent Weeks',
    publisher: 'Orbit Books',
    publishedDate: new Date(2008, 9, 1),
    description:
      'The Way of Shadows is a fantasy novel by Brent Weeks. It is the first book in the Night Angel Trilogy and follows the story of an orphan who becomes an apprentice to a skilled assassin.',
    pageCount: 688,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131941/books/t9dnekzarhixr0zksjrp.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Poppy War',
    ISBN: '9780062662590',
    slug: 'the-poppy-war',
    author: 'R.F. Kuang',
    publisher: 'HarperCollins',
    publishedDate: new Date(2018, 5, 1),
    description:
      'The Poppy War is a dark fantasy novel by R.F. Kuang. It follows the story of a young orphan girl who rises through the ranks of an elite military academy and discovers her extraordinary magical abilities.',
    pageCount: 544,
    imageLink: 'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697809645/books/phjhwa6mdqbiyfl8p9pn.webp',
    language: 'EN',
    currentPrice: 13.49,
    originalPrice: 13.49,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Uprooted',
    ISBN: '9780804179041',
    slug: 'uprooted',
    author: 'Naomi Novik',
    publisher: 'Del Rey',
    publishedDate: new Date(2015, 5, 19),
    description:
      'Uprooted is a fantasy novel by Naomi Novik. It tells the tale of a young woman chosen to serve a powerful and capricious wizard known as the Dragon in a remote and corrupted village.',
    pageCount: 448,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/aoxrt81ytc5ud34pvtja.webp',
    language: 'EN',
    currentPrice: 13.99,
    originalPrice: 13.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'Spinning Silver',
    ISBN: '9780399180996',
    slug: 'spinning-silver',
    author: 'Naomi Novik',
    publisher: 'Del Rey',
    publishedDate: new Date(2018, 7, 10),
    description:
      'Spinning Silver is a fantasy novel by Naomi Novik. It reimagines the Rumpelstiltskin fairy tale, interweaving the lives of three strong-willed women in a world of magic, winter, and intrigue.',
    pageCount: 480,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/kzapunpoxe43jqintnf4.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fantasy'
        },
        {
          slug: 'science-fiction'
        }
      ]
    }
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    ISBN: '9780307949486',
    slug: 'the-girl-with-the-dragon-tattoo',
    author: 'Stieg Larsson',
    publisher: 'Vintage Crime/Black Lizard',
    publishedDate: new Date(2011, 10, 22),
    description:
      'The Girl with the Dragon Tattoo is a crime thriller novel by the late Swedish author and journalist Stieg Larsson. It follows the investigation of a journalist and a hacker into a decades-old disappearance case.',
    pageCount: 672,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/eafcctip1uhwo5dvosut.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'The Da Vinci Code',
    ISBN: '9781409091158',
    slug: 'the-da-vinci-code',
    author: 'Dan Brown',
    publisher: 'Random House',
    publishedDate: new Date(2010, 6, 6),
    description:
      'The Da Vinci Code is a mystery thriller novel by Dan Brown. The story follows a symbologist and a cryptologist as they unravel a series of clues hidden in famous artworks, leading to a shocking revelation.',
    pageCount: 592,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/l85ngwowgnchdpdokl0b.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 12.99,
    discount: 30,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },

  {
    title: 'The Silent Patient',
    ISBN: '9781250301697',
    slug: 'the-silent-patient',
    author: 'Alex Michaelides',
    publisher: 'Celadon Books',
    publishedDate: new Date(2019, 1, 5),
    description:
      'The Silent Patient is a psychological thriller novel by Alex Michaelides. The story revolves around a woman who stops speaking after shooting her husband, and a psychotherapist who becomes obsessed with uncovering the truth.',
    pageCount: 336,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131938/books/bt8rypkftd5frpom99jz.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'Sharp Objects',
    ISBN: '9780307341556',
    slug: 'sharp-objects',
    author: 'Gillian Flynn',
    publisher: 'Shaye Areheart Books',
    publishedDate: new Date(2006, 8, 26),
    description:
      'Sharp Objects is a psychological thriller novel by Gillian Flynn. The story follows a journalist returning to her hometown to cover the murder of two young girls, unraveling dark secrets from her past.',
    pageCount: 254,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/eokh4ec5jxqlcaaoptb7.webp',
    language: 'EN',
    currentPrice: 13.99,
    originalPrice: 13.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        },
        {
          slug: 'horror-tales'
        }
      ]
    }
  },
  {
    title: 'The Woman in the Window',
    ISBN: '9780062678416',
    slug: 'the-woman-in-the-window',
    author: 'A.J. Finn',
    publisher: 'William Morrow',
    publishedDate: new Date(2018, 0, 2),
    description:
      "The Woman in the Window is a psychological thriller novel by A.J. Finn. The protagonist, an agoraphobic woman, believes she witnesses a crime in her neighbor's house, leading to a series of disturbing events.",
    pageCount: 427,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/jtxkxjauj2fof8ldqyer.webp',
    language: 'EN',
    currentPrice: 7.49,
    originalPrice: 9.99,
    discount: 25,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'Before I Go to Sleep',
    ISBN: '9780062060556',
    slug: 'before-i-go-to-sleep',
    author: 'S.J. Watson',
    publisher: 'HarperCollins',
    publishedDate: new Date(2011, 5, 14),
    description:
      'Before I Go to Sleep is a psychological thriller novel by S.J. Watson. The story revolves around a woman suffering from amnesia and her daily struggle to reconstruct her past, leading to shocking discoveries.',
    pageCount: 359,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/xt9tv01b97izvyg58pqn.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'The Girl on the Train',
    ISBN: '9781594634024',
    slug: 'the-girl-on-the-train',
    author: 'Paula Hawkins',
    publisher: 'Riverhead Books',
    publishedDate: new Date(2015, 0, 13),
    description:
      'The Girl on the Train is a psychological thriller novel by Paula Hawkins. The narrative alternates between the perspectives of three women, unraveling a complex web of deception, obsession, and murder.',
    pageCount: 323,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131937/books/dhougjyv2cmbe9sykvhs.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'In the Woods',
    ISBN: '9780143113492',
    slug: 'in-the-woods',
    author: 'Tana French',
    publisher: 'Penguin Books',
    publishedDate: new Date(2007, 4, 17),
    description:
      'In the Woods is a mystery thriller novel by Tana French. The story follows a detective investigating the murder of a young girl in a small Irish town, revealing connections to his own traumatic past.',
    pageCount: 429,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131938/books/gzkwguekyu4ayrpixddi.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'The Hound of the Baskervilles',
    ISBN: '9780140437867',
    slug: 'the-hound-of-the-baskervilles',
    author: 'Arthur Conan Doyle',
    publisher: 'Penguin Classics',
    publishedDate: new Date(1902, 3, 15),
    description:
      'The Hound of the Baskervilles is a mystery novel by Sir Arthur Conan Doyle. It features Sherlock Holmes and Dr. John Watson investigating the mysterious death of Sir Charles Baskerville and the legend of a ghostly hound.',
    pageCount: 196,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/zyibotrzmqo4ffmzacuf.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'The Maid',
    ISBN: '9780593356159',
    slug: 'the-maid',
    author: 'Nita Prose',
    publisher: 'Ballantine Books',
    publishedDate: new Date(2022, 0, 4),
    description:
      "It begins like any other day for Molly Gray, silently dusting her way through the luxury rooms at the Regency Grand Hotel. But when she enters suite 401 and discovers an infamous guest dead in his bed, a very messy mystery begins to unfold. And Molly's at the heart of it - because if anyone can uncover the secrets beneath the surface, the fingerprints amongst the filth - it's the maid...",
    pageCount: 304,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131938/books/nljcwszewbf29tdbmocz.webp',
    language: 'EN',
    currentPrice: 14.99,
    originalPrice: 14.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'Book Lovers',
    ISBN: '9780593334836',
    slug: 'book-lovers',
    author: 'Emily Henry',
    publisher: 'Berkley',
    publishedDate: new Date(2022, 4, 4),
    description:
      "Book Lovers follows Nora Stephens, a literary agent who brokers book deals for her clients. She's not a heroine in the traditional sense. She's no one's sweetheart, not laid-back, and definitely can't be called plucky. However, she's cut-throat when it comes to championing books, and her little sister, Libby.",
    pageCount: 377,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/opicdnstupxcvvgcgfaa.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 14.99,
    discount: 35,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'romance'
        }
      ]
    }
  },
  {
    title: 'Pride and Prejudice',
    ISBN: '9780141439518',
    slug: 'pride-and-prejudice',
    author: 'Jane Austen',
    publisher: 'Penguin Classics',
    publishedDate: new Date(1813, 0, 28),
    description:
      'Pride and Prejudice is a romantic novel by Jane Austen. It follows the tumultuous relationship between Elizabeth Bennet and Mr. Darcy and explores themes of love, class, and societal expectations.',
    pageCount: 435,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/ls5k7vfc8u6jraqici4u.webp',
    language: 'EN',
    currentPrice: 0.99,
    originalPrice: 0.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'romance'
        }
      ]
    }
  },
  {
    title: 'Outlander',
    ISBN: '9780440423201',
    slug: 'outlander',
    author: 'Diana Gabaldon',
    publisher: 'Delacorte Press',
    publishedDate: new Date(1991, 5, 1),
    description:
      'Outlander is a historical romance novel by Diana Gabaldon. It tells the story of Claire Randall, a World War II nurse, who is transported back in time to 18th-century Scotland, where she finds love and adventure.',
    pageCount: 662,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/wuxiv9uwwm1tcg1rpsbp.webp',
    language: 'EN',
    currentPrice: 14.99,
    originalPrice: 14.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'romance'
        },
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'The Notebook',
    ISBN: '9780446615152',
    slug: 'the-notebook',
    author: 'Nicholas Sparks',
    publisher: 'Grand Central',
    publishedDate: new Date(1996, 9, 1),
    description:
      'The Notebook is a romantic novel by Nicholas Sparks. It follows the lifelong love story of Noah Calhoun and Allie Nelson, spanning decades and overcoming various challenges.',
    pageCount: 227,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131937/books/opkxfqluzv39vdzzmixe.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'romance'
        },
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'Me Before You',
    ISBN: '9780143124542',
    slug: 'me-before-you',
    author: 'Jojo Moyes',
    publisher: 'Penguin Books',
    publishedDate: new Date(2012, 11, 31),
    description:
      'Me Before You is a romantic novel by Jojo Moyes. It tells the story of the relationship between Louisa Clark, a young woman with a big heart, and Will Traynor, a quadriplegic man, exploring themes of love, sacrifice, and self-discovery.',
    pageCount: 400,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131940/books/jch2dsiarxwkeefdehvc.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'romance'
        }
      ]
    }
  },
  {
    title: 'The Fault in Our Stars',
    ISBN: '9780525478812',
    slug: 'the-fault-in-our-stars',
    author: 'John Green',
    publisher: 'Dutton Books',
    publishedDate: new Date(2012, 0, 10),
    description:
      'The Fault in Our Stars is a contemporary romance novel by John Green. It follows the love story between Hazel Grace Lancaster, a young cancer patient, and Augustus Waters, exploring themes of love, loss, and the human spirit.',
    pageCount: 313,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131937/books/cwcaxlwidkrgythhkdrk.webp',
    language: 'EN',
    currentPrice: 7.99,
    originalPrice: 7.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'romance'
        }
      ]
    }
  },
  {
    title: 'The Office BFFs',
    ISBN: '9780063007604',
    slug: 'the-office-bffs',
    author: 'Jenna Fischer',
    publisher: 'Dey Street Books',
    publishedDate: new Date(2022, 4, 17),
    description:
      "An intimate, behind-the-scenes, richly illustrated celebration of beloved The Office co-stars Jenna Fischer and Angela Kinsey's friendship, and an insiders' view of Pam Beesly, Angela Martin, and the unforgettable cast of the hit series' iconic characters. Featuring many never-before-seen photos.",
    pageCount: 321,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/angsv3u12jvgumufhemo.webp',
    language: 'EN',
    currentPrice: 19.99,
    originalPrice: 19.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'humor'
        }
      ]
    }
  },
  {
    title: "The Hitchhiker's Guide to the Galaxy",
    ISBN: '9780345391803',
    slug: 'the-hitchhikers-guide-to-the-galaxy',
    author: 'Douglas Adams',
    publisher: 'Del Rey',
    publishedDate: new Date(1979, 8, 12),
    description:
      "The Hitchhiker's Guide to the Galaxy is a comedic science fiction series by Douglas Adams. It follows the misadventures of Arthur Dent, an unwitting human traveling through space after Earth's destruction, accompanied by an eclectic group of characters.",
    pageCount: 216,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131938/books/egs6kae1skxilczxhxdy.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'humor'
        }
      ]
    }
  },
  {
    title: 'Catch-22',
    ISBN: '9780684833392',
    slug: 'catch-22',
    author: 'Joseph Heller',
    publisher: 'Simon & Schuster',
    publishedDate: new Date(1961, 9, 10),
    description:
      'Catch-22 is a satirical novel by Joseph Heller. Set during World War II, it follows the experiences of Captain John Yossarian, a U.S. Army Air Forces B-25 bombardier, and explores the absurdity of bureaucracy and war.',
    pageCount: 453,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/zyggt6pcql8uxps82lhp.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'humor'
        }
      ]
    }
  },
  {
    title: 'Bossypants',
    ISBN: '9780316056866',
    slug: 'bossypants',
    author: 'Tina Fey',
    publisher: 'Reagan Arthur Books',
    publishedDate: new Date(2011, 3, 5),
    description:
      "Bossypants is a memoir and comedy book by Tina Fey. It offers a humorous and insightful look into Fey's life, career, and experiences in the entertainment industry, blending humor with candid anecdotes.",
    pageCount: 283,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/dbvw3xvdapk4nafljhka.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 14.99,
    discount: 35,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'humor'
        }
      ]
    }
  },
  {
    title: 'Hidden Pictures',
    ISBN: '9781250819345',
    slug: 'hidden-pictures',
    author: 'Jason Rekulak',
    publisher: 'Flatiron Books',
    publishedDate: new Date(2022, 4, 10),
    description:
      'A wildly inventive spin on the supernatural thriller, about a woman working as a nanny for a young boy with strange and disturbing secrets.',
    pageCount: 372,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/l2ptiy4tod6mczy7d2os.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 14.99,
    discount: 35,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'horror-tales'
        },
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  },
  {
    title: 'The Exorcist',
    ISBN: '9780061007224',
    slug: 'the-exorcist',
    author: 'William Peter Blatty',
    publisher: 'Harper & Row',
    publishedDate: new Date(1971, 10, 4),
    description:
      'The Exorcist is a horror novel by William Peter Blatty. It tells the chilling story of the possession of a young girl named Regan MacNeil and the desperate attempts of two priests to perform an exorcism and save her soul.',
    pageCount: 385,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/xsnjmadiqytaqfzrrbpo.webp',
    language: 'EN',
    currentPrice: 13.99,
    originalPrice: 13.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'horror-tales'
        }
      ]
    }
  },
  {
    title: 'It',
    ISBN: '9781501175466',
    slug: 'it',
    author: 'Stephen King',
    publisher: 'Scribner',
    publishedDate: new Date(1986, 8, 15),
    description:
      'It is a horror novel by Stephen King. The story revolves around a group of children who confront a malevolent entity that takes the form of Pennywise the Dancing Clown in the small town of Derry, Maine.',
    pageCount: 1138,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131937/books/zsz0u8qetc6skokkwcjv.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'horror-tales'
        }
      ]
    }
  },
  {
    title: 'Psycho',
    ISBN: '9781593083933',
    slug: 'psycho',
    author: 'Robert Bloch',
    publisher: 'Atria Books',
    publishedDate: new Date(1959, 2, 11),
    description:
      'Psycho is a psychological horror novel by Robert Bloch. It follows the disturbing events surrounding Norman Bates, the manager of the Bates Motel, and his unsettling relationship with his mother, Norma.',
    pageCount: 208,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/z7dauzwcorup01vy5m4v.webp',
    language: 'EN',
    currentPrice: 7.99,
    originalPrice: 7.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'horror-tales'
        }
      ]
    }
  },
  {
    title: 'Be Useful: Seven Tools for Life',
    ISBN: '9780593655955',
    slug: 'be-useful-seven-tools-for-life',
    author: 'Arnold Schwarzenegger',
    publisher: 'Penguin',
    publishedDate: new Date(2023, 9, 10),
    description:
      'The seven rules to follow to realize your true purpose in life—distilled by Arnold Schwarzenegger from his own journey of ceaseless reinvention and extraordinary achievement, and available for absolutely anyone.',
    pageCount: 288,
    imageLink: 'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697809645/books/tmgmoubpyelfmynzklyb.webp',
    language: 'EN',
    currentPrice: 14.99,
    originalPrice: 14.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'biography-autobiography'
        },
        {
          slug: 'health-fitness'
        }
      ]
    }
  },
  {
    title: 'The Four-Hour Body',
    ISBN: '9780307463630',
    slug: 'the-four-hour-body',
    author: 'Timothy Ferriss',
    publisher: 'Crown Archetype',
    publishedDate: new Date(2010, 11, 14),
    description:
      'The Four-Hour Body is a health and fitness book by Timothy Ferriss. It explores various approaches to physical and mental improvement, including fitness, nutrition, and lifestyle changes, focusing on efficiency and effectiveness.',
    pageCount: 592,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/f640fgevaqawe0isj2qc.webp',
    language: 'EN',
    currentPrice: 14.99,
    originalPrice: 14.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'self-help'
        },
        {
          slug: 'health-fitness'
        }
      ]
    }
  },
  {
    title:
      'Born to Run',
    ISBN: '9780307266309',
    slug: 'born-to-run',
    author: 'Christopher McDougall',
    publisher: 'Knopf',
    publishedDate: new Date(2009, 4, 5),
    description:
      'Born to Run is a non-fiction book by Christopher McDougall. It explores the culture and science of long-distance running, highlighting the Tarahumara Indians in Mexico and their extraordinary running abilities.',
    pageCount: 287,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/xgcuhqttqwegxhbhfnmp.webp',
    language: 'EN',
    currentPrice: 13.99,
    originalPrice: 13.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'health-fitness'
        }
      ]
    }
  },
  {
    title: 'The Diary of a Young Girl',
    ISBN: '9780553296983',
    slug: 'the-diary-of-a-young-girl',
    author: 'Anne Frank',
    publisher: 'Bantam',
    publishedDate: new Date(1947, 5, 25),
    description:
      'The Diary of a Young Girl is the personal diary of Anne Frank, a Jewish girl hiding with her family during the Nazi occupation of the Netherlands. It provides a poignant account of her experiences and thoughts during this difficult time.',
    pageCount: 283,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131938/books/rvepoehvranfnsvnwrg6.webp',
    language: 'EN',
    currentPrice: 7.99,
    originalPrice: 7.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'biography-autobiography'
        }
      ]
    }
  },
  {
    title: 'Steve Jobs',
    ISBN: '9781451648539',
    slug: 'steve-jobs',
    author: 'Walter Isaacson',
    publisher: 'Simon & Schuster',
    publishedDate: new Date(2011, 10, 24),
    description:
      "Steve Jobs is a biography of the co-founder of Apple Inc., Steve Jobs, written by Walter Isaacson. The book explores Jobs' life, career, and impact on the technology industry, detailing his innovations, successes, and challenges.",
    pageCount: 630,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131944/books/pyurm7l4iuppcablj5x7.webp',
    language: 'EN',
    currentPrice: 16.99,
    originalPrice: 16.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'biography-autobiography'
        }
      ]
    }
  },
  {
    title: 'Malcolm X: A Life of Reinvention',
    ISBN: '9780670022205',
    slug: 'malcolm-x',
    author: 'Manning Marable',
    publisher: 'Viking',
    publishedDate: new Date(2011, 3, 4),
    description:
      'Malcolm X: A Life of Reinvention is a biography of the civil rights leader Malcolm X, written by Manning Marable. The book offers a comprehensive and nuanced portrait of Malcolm X, exploring his evolution as a political activist and his impact on the civil rights movement.',
    pageCount: 608,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/gktwld85jfs3taegvzkr.webp',
    language: 'EN',
    currentPrice: 16.99,
    originalPrice: 16.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'biography-autobiography'
        }
      ]
    }
  },
  {
    title: 'The 7 Habits of Highly Effective People',
    ISBN: '9781982137137',
    slug: 'the-7-habits-of-highly-effective-people',
    author: 'Stephen R. Covey',
    publisher: 'Simon & Schuster',
    publishedDate: new Date(1989, 8, 15),
    description:
      'The 7 Habits of Highly Effective People is a self-help book by Stephen R. Covey. It presents a principle-centered approach for solving personal and professional problems, emphasizing character development and ethical decision-making.',
    pageCount: 464,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131938/books/v5r1r6jjelhzftabumxg.webp',
    language: 'EN',
    currentPrice: 11.99,
    originalPrice: 16.99,
    discount: 30,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'self-help'
        }
      ]
    }
  },
  {
    title: 'You Are a Badass',
    ISBN: '9780762447695',
    slug: 'you-are-a-badass',
    author: 'Jen Sincero',
    publisher: 'Running Press',
    publishedDate: new Date(2013, 4, 1),
    description:
      'You Are a Badass is a self-help book by Jen Sincero. It offers motivational advice and practical exercises to help readers overcome self-doubt, embrace their potential, and create a life they love.',
    pageCount: 256,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131937/books/a689zpkc7tmgnti6fuoz.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 8.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'self-help'
        }
      ]
    }
  },
  {
    title: 'Ways of Seeing',
    ISBN: '9780140135152',
    slug: 'ways-of-seeing',
    author: 'John Berger',
    publisher: 'Penguin Books',
    publishedDate: new Date(1972, 6, 1),
    description:
      'Ways of Seeing is a classic art book by John Berger. It explores the interpretation of art and the impact of reproductions on our perception, challenging traditional notions of art appreciation.',
    pageCount: 176,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/gjoxasmljhp00jfekoqs.webp',
    language: 'EN',
    currentPrice: 8.99,
    originalPrice: 8.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'art'
        }
      ]
    }
  },
  {
    title: 'The Story of Art',
    ISBN: '9780714833552',
    slug: 'the-story-of-art',
    author: 'E.H. Gombrich',
    publisher: 'Phaidon Press',
    publishedDate: new Date(1950, 1, 17),
    description:
      'The Story of Art is a renowned art history book by E.H. Gombrich. It provides an overview of the history of art, from ancient civilizations to modern times, offering insights into various art movements and styles.',
    pageCount: 688,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131943/books/os3bvuwclmwwabh5inkc.webp',
    language: 'EN',
    currentPrice: 9.99,
    originalPrice: 9.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'art'
        }
      ]
    }
  },
  {
    title: 'Art Through the Ages',
    ISBN: '9781285837840',
    slug: 'art-through-the-ages',
    author: 'Helen Gardner',
    publisher: 'Cengage Learning',
    publishedDate: new Date(1926, 0, 1),
    description:
      'Art Through the Ages is a comprehensive art history textbook by Helen Gardner and Fred S. Kleiner. It covers a wide range of art movements, styles, and periods, providing detailed information about artworks and their cultural contexts.',
    pageCount: 1248,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131937/books/zzbslgsikttavnnshs5g.webp',
    language: 'EN',
    currentPrice: 15.99,
    originalPrice: 15.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'art'
        }
      ]
    }
  },
  {
    title: 'One Hundred Years of Solitude',
    ISBN: '9780061120091',
    slug: 'one-hundred-years-of-solitude',
    author: 'Gabriel García Márquez',
    publisher: 'Harper & Row',
    publishedDate: new Date(1967, 4, 30),
    description:
      'One Hundred Years of Solitude is a landmark novel by Gabriel García Márquez. It chronicles the Buendía family over seven generations in the fictional town of Macondo, blending magical realism with political and social commentary.',
    pageCount: 417,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/n8encdvmxktzq1urh65x.webp',
    language: 'EN',
    currentPrice: 11.99,
    originalPrice: 11.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'Moby-Dick',
    ISBN: '9780142437247',
    slug: 'moby-dick',
    author: 'Herman Melville',
    publisher: 'Penguin Classics',
    publishedDate: new Date(1851, 10, 14),
    description:
      'Moby-Dick is an epic novel by Herman Melville. It follows the obsessive quest of Captain Ahab to kill the giant white sperm whale Moby Dick, exploring themes of revenge, fate, and the complexities of humanity.',
    pageCount: 654,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131942/books/jom5pjziphupzsnr5gun.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'Jane Eyre',
    ISBN: '9780141441146',
    slug: 'jane-eyre',
    author: 'Charlotte Brontë',
    publisher: 'Penguin Classics',
    publishedDate: new Date(1847, 9, 16),
    description:
      'Jane Eyre is a novel by Charlotte Brontë. It tells the story of Jane Eyre, an orphan who becomes a governess and falls in love with her employer, Mr. Rochester. The novel explores themes of love, morality, and social class.',
    pageCount: 624,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697131939/books/dqv72dlt1cjvbkgb4a88.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'To Kill a Mockingbird',
    ISBN: '9780061120084',
    slug: 'to-kill-a-mockingbird',
    author: 'Harper Lee',
    publisher: 'HarperCollins',
    publishedDate: new Date(1960, 6, 11),
    description:
      "Voted America's Best-Loved Novel in PBS's The Great American Read Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred One of the most cherished stories of all time, To Kill a Mockingbird has been translated into more than forty languages, sold more than forty million copies worldwide, served as the basis for an enormously popular motion picture, and was voted one of the best novels of the twentieth century by librarians across the country. A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice, it views a world of great beauty and savage inequities through the eyes of a young girl, as her father—a crusading local lawyer—risks everything to defend a black man unjustly accused of a terrible crime.",
    pageCount: 281,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697215839/books/p4fy9ehc4mo0wugruxvt.webp',
    language: 'EN',
    currentPrice: 13.99,
    originalPrice: 13.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'The Great Gatsby',
    ISBN: '9780743273565',
    slug: 'the-great-gatsby',
    author: 'F. Scott Fitzgerald',
    publisher: 'Scribner',
    publishedDate: new Date(1925, 3, 10),
    description:
      "The only authorized edition of the twentieth-century classic, featuring F. Scott Fitzgerald's final revisions, a foreword by his granddaughter, and a new introduction by National Book Award winner Jesmyn Ward. The Great Gatsby, F. Scott Fitzgerald's third book, stands as the supreme achievement of his career. First published in 1925, this quintessential novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted “gin was the national drink and sex the national obsession,” it is an exquisitely crafted tale of America in the 1920s.",
    pageCount: 218,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697215839/books/orvgeowmwmdqc5frsr54.webp',
    language: 'EN',
    currentPrice: 14.99,
    originalPrice: 14.99,
    discount: 0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: "The Handmaid's Tale",
    ISBN: '9780385490818',
    slug: 'the-handmaids-tale',
    author: 'Margaret Atwood',
    publisher: 'Anchor',
    publishedDate: new Date(1985, 8, 29),
    description:
      "NOW A SMASH-HIT CHANNEL 4 TV SERIES 'It isn't running away they're afraid of. We wouldn't get far. It's those other escapes, the ones you can open in yourself, given a cutting edge' Offred is a Handmaid. She has only one function: to breed. If she refuses to play her part she will, like all dissenters, be hanged at the wall or sent out to die slowly of radiation sickness. She may walk daily to the market and utter demure words to other Handmaid's, but her role is fixed, her freedom a forgotten concept. Offred remembers her old life - love, family, a job, access to the news. It has all been taken away. But even a repressive state cannot obliterate desire. Includes exclusive content: In The 'Backstory' you can read Margaret Atwood's account of how she came to write this landmark dystopian novel 'Compulsively readable' Daily Telegraph",
    pageCount: 311,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697215839/books/ew8giwmmremertqyr3wd.webp',
    language: 'EN',
    currentPrice: 11.99,
    originalPrice: 11.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'fiction-literature'
        }
      ]
    }
  },
  {
    title: 'Good Omens',
    ISBN: '9781448110230',
    slug: 'good-omens',
    author: 'Neil Gaiman, Terry Pratchett',
    publisher: 'William Morrow',
    publishedDate: new Date(1990, 4, 1),
    description:
      'Good Omens is a humorous fantasy novel co-written by Neil Gaiman and Terry Pratchett. It follows the hilarious misadventures of an angel and a demon trying to prevent the apocalypse.',
    pageCount: 413,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697215839/books/pqanonaj6jl6mk0mxxwd.webp',
    language: 'EN',
    currentPrice: 12.99,
    originalPrice: 12.99,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'humor'
        }
      ]
    }
  },
  {
    title: 'Gone Girl',
    ISBN: '9780297859406',
    slug: 'gone-girl',
    author: 'Gillian Flynn',
    publisher: 'Crown Publishing Group',
    publishedDate: new Date(2012, 4, 5),
    description:
      "Who are you? What have we done to each other? These are the questions Nick Dunne finds himself asking on the morning of his fifth wedding anniversary, when his wife Amy suddenly disappears. The police suspect Nick. Amy's friends reveal that she was afraid of him, that she kept secrets from him. He swears it isn't true. A police examination of his computer shows strange searches. He says they weren't made by him. And then there are the persistent calls on his mobile phone. So what really did happen to Nick's beautiful wife?",
    pageCount: 320,
    imageLink:
      'https://res.cloudinary.com/dtozxzg7o/image/upload/v1697215839/books/grosprhiepxo5ptcjwqx.webp',
    language: 'EN',
    currentPrice: 13.49,
    originalPrice: 13.49,
    discount: 0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connect: [
        {
          slug: 'mistery-thrillers'
        }
      ]
    }
  }
];

export const users: MockUser[] = [
  {
    email: 'johndoe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    password: bcrypt.hashSync('Test1234', 10),
    role: 'USER' as Role,
    customerId: 'cus_P1Uc41jGrwPaUY',
    addresses: {
      createMany: {
        data: [
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+34123456789',
            countryCode: 'ES',
            country: 'Spain',
            province: 'Barcelona',
            city: 'Barcelona',
            postalCode: '08001',
            address: 'Fake Street 123'
          },
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+34123456789',
            countryCode: 'ES',
            country: 'Spain',
            province: 'Madrid',
            city: 'Madrid',
            postalCode: '08121',
            address: 'Fake Street 456'
          }
        ]
      }
    },
    wishlist: ['jane-eyre', 'moby-dick', 'a-song-of-ice-and-fire'],
    orders: [
      {
        slug: 'the-hound-of-the-baskervilles',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-hound-of-the-baskervilles').currentPrice
      },
      {
        slug: 'the-fault-in-our-stars',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-fault-in-our-stars').currentPrice
      },
      {
        slug: 'a-song-of-ice-and-fire',
        quantity: 1,
        price: books.find((book) => book.slug === 'a-song-of-ice-and-fire').currentPrice
      },
      {
        slug: 'outlander',
        quantity: 1,
        price: books.find((book) => book.slug === 'outlander').currentPrice
      },
      {
        slug: 'elantris',
        quantity: 1,
        price: books.find((book) => book.slug === 'elantris').currentPrice
      },
      {
        slug: 'the-black-prism',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-black-prism').currentPrice
      },
      {
        slug: 'the-silent-patient',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-silent-patient').currentPrice
      },
      {
        slug: 'before-i-go-to-sleep',
        quantity: 1,
        price: books.find((book) => book.slug === 'before-i-go-to-sleep').currentPrice
      },
      {
        slug: 'gone-girl',
        quantity: 1,
        price: books.find((book) => book.slug === 'gone-girl').currentPrice
      },
      {
        slug: 'the-lies-of-locke-lamora',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-lies-of-locke-lamora').currentPrice
      },
      {
        slug: 'the-four-hour-body',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-four-hour-body').currentPrice
      },
      {
        slug: 'jane-eyre',
        quantity: 1,
        price: books.find((book) => book.slug === 'jane-eyre').currentPrice
      },
      {
        slug: 'the-exorcist',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-exorcist').currentPrice
      },
      {
        slug: 'one-hundred-years-of-solitude',
        quantity: 1,
        price: books.find((book) => book.slug === 'one-hundred-years-of-solitude').currentPrice
      },
      {
        slug: 'the-name-of-the-wind',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-name-of-the-wind').currentPrice
      },
      {
        slug: 'catch-22',
        quantity: 1,
        price: books.find((book) => book.slug === 'catch-22').currentPrice
      },
      {
        slug: 'born-to-run',
        quantity: 1,
        price: books.find((book) => book.slug === 'born-to-run').currentPrice
      },
      {
        slug: 'the-wise-mans-fear',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-wise-mans-fear').currentPrice
      },
      {
        slug: 'you-are-a-badass',
        quantity: 1,
        price: books.find((book) => book.slug === 'you-are-a-badass').currentPrice
      },
      {
        slug: 'moby-dick',
        quantity: 1,
        price: books.find((book) => book.slug === 'moby-dick').currentPrice
      },
      {
        slug: 'the-woman-in-the-window',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-woman-in-the-window').currentPrice
      },
      {
        slug: 'the-diary-of-a-young-girl',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-diary-of-a-young-girl').currentPrice
      },
      {
        slug: 'uprooted',
        quantity: 1,
        price: books.find((book) => book.slug === 'uprooted').currentPrice
      },
      {
        slug: 'to-kill-a-mockingbird',
        quantity: 1,
        price: books.find((book) => book.slug === 'to-kill-a-mockingbird').currentPrice
      },
      {
        slug: 'psycho',
        quantity: 1,
        price: books.find((book) => book.slug === 'psycho').currentPrice
      },
      {
        slug: 'mistborn-the-final-empire',
        quantity: 1,
        price: books.find((book) => book.slug === 'mistborn-the-final-empire').currentPrice
      },
      {
        slug: 'the-blade-itself',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-blade-itself').currentPrice
      },
      {
        slug: 'a-song-of-ice-and-fire',
        quantity: 1,
        price: books.find((book) => book.slug === 'a-song-of-ice-and-fire').currentPrice
      },
      {
        slug: 'the-fault-in-our-stars',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-fault-in-our-stars').currentPrice
      },
    ],
    ratings: [
      {
        slug: 'the-hound-of-the-baskervilles',
        rating: 4.5
      },
      {
        slug: 'a-song-of-ice-and-fire',
        rating: 3.5
      },
      {
        slug: 'the-fault-in-our-stars',
        rating: 3.5
      },
      {
        slug: 'outlander',
        rating: 3.5
      },
      {
        slug: 'elantris',
        rating: 4.0
      },
      {
        slug: 'the-black-prism',
        rating: 3.5
      },
      {
        slug: 'the-silent-patient',
        rating: 3.5
      },
      {
        slug: 'before-i-go-to-sleep',
        rating: 3.5
      },
      {
        slug: 'gone-girl',
        rating: 4.0
      },
      {
        slug: 'the-lies-of-locke-lamora',
        rating: 3.5
      },
      {
        slug: 'the-four-hour-body',
        rating: 3.5
      },
      {
        slug: 'jane-eyre',
        rating: 4.5
      },
      {
        slug: 'the-exorcist',
        rating: 3.5
      },
    ]
  },
  {
    email: 'jordi@email.com',
    firstName: 'Jordi',
    lastName: 'Doe',
    password: bcrypt.hashSync('Test1234', 10),
    role: 'ADMIN' as Role,
    customerId: 'cus_P1Ul1b3ogF61AQ',
    addresses: {
      createMany: {
        data: [
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+34123456789',
            countryCode: 'ES',
            country: 'Spain',
            province: 'Barcelona',
            city: 'Barcelona',
            postalCode: '08001',
            address: 'Fake Street 123'
          },
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+34123456789',
            countryCode: 'ES',
            country: 'Spain',
            province: 'Madrid',
            city: 'Madrid',
            postalCode: '08121',
            address: 'Fake Street 456'
          }
        ]
      }
    },
    wishlist: ['the-poppy-war'],
    cart: ['the-poppy-war'],
    orders: [
      {
        slug: 'the-lord-of-the-rings',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-lord-of-the-rings').currentPrice
      },
      {
        slug: 'the-hobbit',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-hobbit').currentPrice
      },
      {
        slug: 'a-song-of-ice-and-fire',
        quantity: 1,
        price: books.find((book) => book.slug === 'a-song-of-ice-and-fire').currentPrice
      }
    ],
    ratings: [
      {
        slug: 'a-song-of-ice-and-fire',
        rating: 4.5
      }
    ]
  },
  {
    email: 'raul@email.com',
    firstName: 'Raul',
    lastName: 'Fernandez',
    password: bcrypt.hashSync('Test1234', 10),
    role: 'USER' as Role,
    customerId: 'cus_P1Ul5ST87rf3p8',
    addresses: {
      create: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+34123456789',
        countryCode: 'ES',
        country: 'Spain',
        province: 'Barcelona',
        city: 'Barcelona',
        postalCode: '08001',
        address: 'Fake Street 123'
      }
    },
    wishlist: ['sharp-objects', 'the-silent-patient', 'book-lovers'],
    cart: ['the-lion-the-witch-and-the-wardrobe', 'spinning-silver'],
    orders: [
      {
        slug: 'outlander',
        quantity: 1,
        price: books.find((book) => book.slug === 'outlander').currentPrice
      },
      {
        slug: 'uprooted',
        quantity: 1,
        price: books.find((book) => book.slug === 'uprooted').currentPrice
      },
      {
        slug: 'the-maid',
        quantity: 1,
        price: books.find((book) => book.slug === 'the-maid').currentPrice
      }
    ],
    ratings: [
      {
        slug: 'outlander',
        rating: 3
      },
      {
        slug: 'uprooted',
        rating: 4.5
      },
      {
        slug: 'the-maid',
        rating: 5
      }
    ]
  }
];
