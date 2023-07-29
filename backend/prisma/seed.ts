import { PrismaClient } from '@prisma/client';
import { categories, books, users } from './mock-data';

const prisma = new PrismaClient();

async function main() {
  await prisma.wishlistBook.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.address.deleteMany();
  await prisma.cartBook.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderBook.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true
  });

  const allBooks = books.map((book) => {
    return prisma.book.create({
      data: book,
      include: {
        categories: true
      }
    });
  });
  const booksCreated = await Promise.all(allBooks);

  const allUsers = users.map(
    ({ email, firstName, lastName, password, role, wishlist, addresses, cart, orders }) => {
      if (wishlist.create.hasOwnProperty('books')) {
        wishlist.create.books = {
          createMany: {
            data: [
              {
                bookId: booksCreated[0].id
              },
              {
                bookId: booksCreated[1].id
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
                bookId: booksCreated[0].id
              },
              {
                bookId: booksCreated[1].id
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
                bookId: booksCreated[0].id,
                quantity: 1,
                price: booksCreated[0].currentPrice
              },
              {
                bookId: booksCreated[1].id,
                quantity: 1,
                price: booksCreated[1].currentPrice
              }
            ]
          }
        };
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
