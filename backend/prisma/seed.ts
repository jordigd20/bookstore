import { PrismaClient } from '@prisma/client';
import { categories, books, users } from './mock-data';

const prisma = new PrismaClient();

async function main() {
  // await prisma.wishlistBook.deleteMany();
  // await prisma.wishlist.deleteMany();
  // await prisma.address.deleteMany();
  // await prisma.ratingUserBook.deleteMany();
  // await prisma.cartBook.deleteMany();
  // await prisma.cart.deleteMany();
  // await prisma.orderBook.deleteMany();
  // await prisma.order.deleteMany();
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
    ({ email, firstName, lastName, password, role, wishlist, addresses, cart, orders }: any) => {
      const bookId1 = booksCreated[0]?.id ?? booksFound[0]?.id;
      const bookId2 = booksCreated[1]?.id ?? booksFound[1]?.id;

      console.log({ booksCreated1: booksCreated[0]?.id, booksCreated2: booksCreated[1]?.id });
      console.log({ booksFound1: booksFound[0]?.id, booksFound2: booksFound[1]?.id });

      if (wishlist.create.hasOwnProperty('books')) {
        wishlist.create.books = {
          createMany: {
            data: [
              {
                bookId: bookId1
              },
              {
                bookId: bookId2
              }
            ]
          }
        };
      }

      if (cart.create.hasOwnProperty('books')) {
        cart.create.books = {
          createMany: {
            data: [
              {
                bookId: bookId1
              },
              {
                bookId: bookId2
              }
            ]
          }
        };
      }

      if (orders.hasOwnProperty('create')) {
        orders.create.books = {
          createMany: {
            data: [
              {
                bookId: bookId1,
                quantity: 1,
                price: booksCreated[0]?.currentPrice ?? booksFound[0]?.currentPrice
              },
              {
                bookId: bookId2,
                quantity: 1,
                price: booksCreated[1]?.currentPrice ?? booksFound[1]?.currentPrice
              }
            ]
          }
        };
        orders.create.status = 'COMPLETED';
      }

      return prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password,
          role,
          wishlist,
          addresses,
          cart,
          orders
        },
        include: {
          wishlist: {
            include: {
              books: true
            }
          },
          addresses: true,
          cart: {
            include: {
              books: true
            }
          },
          orders: {
            include: {
              books: true
            }
          }
        }
      });
    }
  );
  await Promise.all(allUsers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
