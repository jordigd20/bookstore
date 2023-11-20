import { Prisma, PrismaClient } from '@prisma/client';
import { categories, books, users, MockUser } from './mock-data';

const prisma = new PrismaClient();

async function main() {
  // await prisma.wishlistBook.deleteMany();
  // await prisma.wishlist.deleteMany();
  // await prisma.orderBook.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.address.deleteMany();
  // await prisma.ratingUserBook.deleteMany();
  // await prisma.cartBook.deleteMany();
  // await prisma.cart.deleteMany();
  // await prisma.book.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.category.deleteMany();

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true
  });

  const booksFound = await prisma.book.findMany({
    where: {
      ISBN: {
        in: books.map((book) => book.ISBN)
      }
    }
  });

  const booksToCreate = books.filter((book) => {
    return !booksFound.some((bookFound) => bookFound.ISBN === book.ISBN);
  });

  const allBooks = booksToCreate.map((book) => {
    return prisma.book.create({
      data: book,
      include: {
        categories: true
      }
    });
  });
  const booksCreated = await Promise.all(allBooks);

  const usersFound = await prisma.user.findMany({
    where: {
      email: {
        in: users.map((user) => user.email)
      }
    }
  });

  const usersToCreate = users.filter((user) => {
    return !usersFound.some((userFound) => userFound.email === user.email);
  });

  const allUsers = usersToCreate.map(
    async ({ wishlist, cart, orders, ratings, ...user }: MockUser) => {
      const data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> = { ...user };

      if (wishlist) {
        const booksToWishlist = await prisma.book.findMany({
          where: {
            slug: {
              in: wishlist
            }
          }
        });

        data.wishlist = {
          create: {
            books: {
              createMany: {
                data: booksToWishlist.map((book) => {
                  return {
                    bookId: book.id
                  };
                })
              }
            }
          }
        };
      } else {
        data.wishlist = {
          create: {}
        };
      }

      if (cart) {
        const booksToCart = await prisma.book.findMany({
          where: {
            slug: {
              in: cart
            }
          }
        });

        data.cart = {
          create: {
            books: {
              createMany: {
                data: booksToCart.map((book) => {
                  return {
                    bookId: book.id
                  };
                })
              }
            }
          }
        };
      } else {
        data.cart = {
          create: {}
        };
      }

      return prisma.user.create({
        data,
        include: {
          addresses: {
            select: {
              id: true
            }
          }
        }
      });
    }
  );

  const usersCreated = await Promise.all(allUsers);

  const createOrdersAndRatings = usersToCreate.map(
    async ({ orders, ratings, ...user }: MockUser) => {
      const data:
        | (Prisma.Without<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput> &
            Prisma.UserUncheckedUpdateInput)
        | (Prisma.Without<Prisma.UserUncheckedUpdateInput, Prisma.UserUpdateInput> &
            Prisma.UserUpdateInput) = {};

      const userCreated = usersCreated.find((userCreated) => userCreated.email === user.email);

      if (orders) {
        const booksOrdered = await prisma.book.findMany({
          where: {
            slug: {
              in: orders.map((book) => book.slug)
            }
          }
        });

        data.orders = {
          create: {
            books: {
              createMany: {
                data: booksOrdered.map((book) => {
                  return {
                    bookId: book.id,
                    quantity: orders.find((bookOrdered) => bookOrdered.slug === book.slug).quantity,
                    price: book.currentPrice
                  };
                })
              }
            },
            addressId: userCreated.addresses[0].id,
            status: 'COMPLETED',
            total: booksOrdered.reduce((acc, curr) => {
              return acc + Number(curr.currentPrice);
            }, 0)
          }
        };

        if (ratings) {
          data.ratings = {
            createMany: {
              data: ratings.map((book) => {
                return {
                  bookId: booksOrdered.find((bookOrdered) => bookOrdered.slug === book.slug).id,
                  rating: book.rating
                };
              })
            }
          };
        }
      }

      return prisma.user.update({
        where: { id: userCreated.id },
        data
      });
    }
  );

  await Promise.all(createOrdersAndRatings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
