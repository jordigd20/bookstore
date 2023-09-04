import * as bcrypt from 'bcrypt';
type Role = 'ADMIN' | 'USER';

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
      'https://images-na.ssl-images-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg',
    language: 'ES',
    currentPrice: 20.0,
    originalPrice: 25.0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[4],
        where: {
          slug: 'fantasy'
        }
      }
    }
  },
  {
    title: 'Harry Potter and the Philosopher Stone',
    ISBN: '9780261103253',
    slug: 'harry-potter-and-the-philosopher-stone',
    author: 'J.R.R. Tolkien',
    publisher: 'George Allen & Unwin',
    publishedDate: new Date(1954, 6, 29),
    description:
      'The Lord of the Rings is an epic high-fantasy novel written by English author and scholar J. R. R. Tolkien.',
    pageCount: 1178,
    imageLink:
      'https://images-na.ssl-images-amazon.com/images/I/51UoqRAxwEL._SX331_BO1,204,203,200_.jpg',
    language: 'ES',
    currentPrice: 20.0,
    originalPrice: 25.0,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[4],
        where: {
          slug: 'fantasy'
        }
      }
    }
  },
  {
    title: 'To Kill a Mockingbird',
    ISBN: '9780061120084',
    slug: 'to-kill-a-mockingbird',
    author: 'Harper Lee',
    publisher: 'HarperCollins Publishers',
    publishedDate: new Date(1960, 6, 11),
    description:
      "Voted America's Best-Loved Novel in PBS's The Great American Read Harper Lee's Pulitzer Prize-winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred One of the most cherished stories of all time, To Kill a Mockingbird has been translated into more than forty languages, sold more than forty million copies worldwide, served as the basis for an enormously popular motion picture, and was voted one of the best novels of the twentieth century by librarians across the country. A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice, it views a world of great beauty and savage inequities through the eyes of a young girl, as her father—a crusading local lawyer—risks everything to defend a black man unjustly accused of a terrible crime.",
    pageCount: 281,
    imageLink:
      'http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api&w=400',
    language: 'EN',
    currentPrice: 15.0,
    originalPrice: 18.0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[0],
        where: {
          slug: 'fiction-literature'
        }
      }
    }
  },
  {
    title: '1984',
    ISBN: '9780451524935',
    slug: '1984',
    author: 'George Orwell',
    publisher: 'Signet Classic',
    publishedDate: new Date(1949, 5, 8),
    description:
      '1984 is a dystopian novel by George Orwell that examines the dangers of totalitarianism and government overreach. It has had a profound influence on the world of literature and politics.',
    pageCount: 328,
    imageLink:
      'https://books.google.com/books/content?id=wnp2EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api&w=400',
    language: 'EN',
    currentPrice: 12.5,
    originalPrice: 16.0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[0],
        where: {
          slug: 'fiction-literature'
        }
      }
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
      'http://books.google.com/books/content?id=iXn5U2IzVH0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    language: 'EN',
    currentPrice: 14.99,
    originalPrice: 19.99,
    isBestseller: true,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[0],
        where: {
          slug: 'fiction-literature'
        }
      }
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
      'http://books.google.com/books/content?id=Es_PCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    language: 'EN',
    currentPrice: 17.5,
    originalPrice: 22.0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[0],
        where: {
          slug: 'fiction-literature'
        }
      }
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
      'http://books.google.com/books/content?id=B7FL6zzN_FsC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
    language: 'EN',
    currentPrice: 16.99,
    originalPrice: 21.0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[9],
        where: {
          slug: 'humor'
        }
      }
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
      "Who are you? What have we done to each other? These are the questions Nick Dunne finds himself asking on the morning of his fifth wedding anniversary, when his wife Amy suddenly disappears. The police suspect Nick. Amy's friends reveal that she was afraid of him, that she kept secrets from him. He swears it isn't true. A police examination of his computer shows strange searches. He says they weren't made by him. And then there are the persistent calls on his mobile phone. So what really did happen to Nick's beautiful wife? 'Flynn is a brilliantly accomplished psychological crime writer and this latest book is so dark, so twisted and so utterly compelling that it actually messes with your mind' DAILY MAIL 'A near-masterpiece. Flynn is an extraordinary writer who, with every sentence, makes words do things that other writers merely dream of' SOPHIE HANNAH, Sunday Express 'You think you're reading a good, conventional thriller and then it grows into a fascinating portrait of one averagely mismatched relationship...Nothing's as it seems - Flynn is a fabulous plotter, and a very sharp observer of modern life in the aftermath of the credit crunch' THE TIMES 'One of the most popular thrillers of the year is also one of the smartest... Flynn's book cleverly outpaces its neo-noir trappings and consistently surprises the reader.",
    pageCount: 320,
    imageLink:
      'https://images-na.ssl-images-amazon.com/images/I/91KghPz7BuL._SX342_SY445_QL70_ML2_.jpg',
    language: 'EN',
    currentPrice: 18.5,
    originalPrice: 24.0,
    isBestseller: false,
    createdAt: new Date(),
    categories: {
      connectOrCreate: {
        create: categories[2],
        where: {
          slug: 'mistery-thrillers'
        }
      }
    }
  }
];

export const users = [
  {
    email: 'johndoe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    password: bcrypt.hashSync('Test1234', 10),
    role: 'USER' as Role,
    wishlist: {
      create: {
        books: {}
      }
    },
    addresses: {
      createMany: {
        data: [
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '123456789',
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
            phone: '123456789',
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
    cart: {
      create: {
        books: {}
      }
    },
    orders: {
      create: {
        books: {}
      }
    }
  },
  {
    email: 'jordi@email.com',
    firstName: 'Jordi',
    lastName: 'Doe',
    password: bcrypt.hashSync('Test1234', 10),
    role: 'ADMIN' as Role,
    wishlist: {
      create: {}
    },
    addresses: {
      createMany: {
        data: [
          {
            firstName: 'John',
            lastName: 'Doe',
            phone: '123456789',
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
            phone: '123456789',
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
    cart: {
      create: {}
    },
    orders: {}
  },
  {
    email: 'raul@email.com',
    firstName: 'Raul',
    lastName: 'Fernandez',
    password: bcrypt.hashSync('Test1234', 10),
    role: 'USER' as Role,
    wishlist: {
      create: {
        books: {}
      }
    },
    addresses: {
      create: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
        countryCode: 'ES',
        country: 'Spain',
        province: 'Barcelona',
        city: 'Barcelona',
        postalCode: '08001',
        address: 'Fake Street 123'
      }
    },
    cart: {
      create: {
        books: {}
      }
    },
    orders: {
      create: {
        books: {}
      }
    }
  }
];
