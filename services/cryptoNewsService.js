const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

function query(sql, args) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }

            connection.query(sql, args, (err, rows) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    });
}

const createCryptoNewsTableQuery = `
    CREATE TABLE IF NOT EXISTS crypto_news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255), -- New field for image URL
        views INT DEFAULT 0,   -- New field for view counter
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

async function createCryptoNewsTable() {
    try {
        await query(createCryptoNewsTableQuery);
        console.log('Crypto News table created successfully');
    } catch (error) {
        console.error('Error creating Crypto News table:', error);
    }
}

// Execute table creation query
(async () => {
    await createCryptoNewsTable();
    console.log('Crypto News table setup complete');
})();

const cryptoNewsService = {};

cryptoNewsService.getAllCryptoNews = async () => {
    try {
        const selectAllQuery = 'SELECT * FROM crypto_news';
        const news = await query(selectAllQuery);
        return news;
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.getCryptoNewsById = async (id) => {
    try {
        const selectQuery = 'SELECT * FROM crypto_news WHERE id = ?';
        const news = await query(selectQuery, [id]);
        if (news.length > 0) {
            await cryptoNewsService.incrementViews(id);
        }
        return news[0];
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.createCryptoNews = async (newsData) => {
    try {
        const { title, content, author, imageUrl } = newsData;
        const insertQuery = `
            INSERT INTO crypto_news (title, content, author, imageUrl)
            VALUES (?, ?, ?, ?)
        `;
        const result = await query(insertQuery, [title, content, author, imageUrl]);
        return { id: result.insertId, ...newsData };
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.updateCryptoNews = async (id, updatedNewsData) => {
    try {
        const { title, content, author, imageUrl } = updatedNewsData;
        const updateQuery = `
            UPDATE crypto_news
            SET title=?, content=?, author=?, imageUrl=?
            WHERE id=?
        `;
        await query(updateQuery, [title, content, author, imageUrl, id]);
        return { id, ...updatedNewsData };
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.deleteCryptoNews = async (id) => {
    try {
        const deleteQuery = 'DELETE FROM crypto_news WHERE id = ?';
        await query(deleteQuery, [id]);
        return { id };
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.getLatestCryptoNews = async (limit = 5) => {
    try {
        const latestQuery = `
            SELECT * FROM crypto_news
            ORDER BY createdAt DESC
            LIMIT ?
        `;
        const news = await query(latestQuery, [limit]);
        return news;
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.getRecentCryptoNews = async (days = 7) => {
    try {
        const recentQuery = `
            SELECT * FROM crypto_news
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)
            ORDER BY createdAt DESC
        `;
        const news = await query(recentQuery, [days]);
        return news;
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.getTrendingCryptoNews = async (threshold = 3) => {
    try {
        const trendingQuery = `
            SELECT * FROM crypto_news
            WHERE views >= ?
            ORDER BY views DESC
        `;
        const news = await query(trendingQuery, [threshold]);
        return news;
    } catch (error) {
        throw error;
    }
};

cryptoNewsService.incrementViews = async (id) => {
    try {
        const updateViewsQuery = `
            UPDATE crypto_news
            SET views = views + 1
            WHERE id = ?
        `;
        await query(updateViewsQuery, [id]);
    } catch (error) {
        throw error;
    }
};

module.exports = cryptoNewsService;



// const mysql = require('mysql');
// const dotenv = require('dotenv');

// dotenv.config();

// const pool = mysql.createPool({
//     connectionLimit: process.env.CONNECTION_LIMIT,
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// function query(sql, args) {
//     return new Promise((resolve, reject) => {
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 return reject(err);
//             }

//             connection.query(sql, args, (err, rows) => {
//                 connection.release();
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(rows);
//             });
//         });
//     });
// }

// const createCryptoNewsTableQuery = `
//     CREATE TABLE IF NOT EXISTS crypto_news (
//         id INT AUTO_INCREMENT PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         content TEXT NOT NULL,
//         author VARCHAR(255) NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
// `;

// async function createCryptoNewsTable() {
//     try {
//         await query(createCryptoNewsTableQuery);
//         console.log('Crypto News table created successfully');
//     } catch (error) {
//         console.error('Error creating Crypto News table:', error);
//     }
// }

// // Execute table creation query
// (async () => {
//     await createCryptoNewsTable();
//     console.log('Crypto News table setup complete');
// })();

// const cryptoNewsService = {};

// cryptoNewsService.getAllCryptoNews = async () => {
//     try {
//         const selectAllQuery = 'SELECT * FROM crypto_news';
//         const news = await query(selectAllQuery);
//         return news;
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.getCryptoNewsById = async (id) => {
//     try {
//         const selectQuery = 'SELECT * FROM crypto_news WHERE id = ?';
//         const news = await query(selectQuery, [id]);
//         return news[0];
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.createCryptoNews = async (newsData) => {
//     try {
//         const { title, content, author } = newsData;
//         const insertQuery = `
//             INSERT INTO crypto_news (title, content, author)
//             VALUES (?, ?, ?)
//         `;
//         const result = await query(insertQuery, [title, content, author]);
//         return { id: result.insertId, ...newsData };
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.updateCryptoNews = async (id, updatedNewsData) => {
//     try {
//         const { title, content, author } = updatedNewsData;
//         const updateQuery = `
//             UPDATE crypto_news
//             SET title=?, content=?, author=?
//             WHERE id=?
//         `;
//         await query(updateQuery, [title, content, author, id]);
//         return { id, ...updatedNewsData };
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.deleteCryptoNews = async (id) => {
//     try {
//         const deleteQuery = 'DELETE FROM crypto_news WHERE id = ?';
//         await query(deleteQuery, [id]);
//         return { id };
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.getLatestCryptoNews = async (limit = 5) => {
//     try {
//         const latestQuery = `
//             SELECT * FROM crypto_news
//             ORDER BY createdAt DESC
//             LIMIT ?
//         `;
//         const news = await query(latestQuery, [limit]);
//         return news;
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.getRecentCryptoNews = async (days = 7) => {
//     try {
//         const recentQuery = `
//             SELECT * FROM crypto_news
//             WHERE createdAt >= DATE_SUB(NOW(), INTERVAL ? DAY)
//             ORDER BY createdAt DESC
//         `;
//         const news = await query(recentQuery, [days]);
//         return news;
//     } catch (error) {
//         throw error;
//     }
// };

// cryptoNewsService.getTrendingCryptoNews = async (threshold = 3) => {
//     try {
//         const trendingQuery = `
//             SELECT *, COUNT(*) AS views FROM crypto_news_views
//             JOIN crypto_news ON crypto_news.id = crypto_news_views.news_id
//             GROUP BY crypto_news.id
//             HAVING views >= ?
//             ORDER BY views DESC
//         `;
//         const news = await query(trendingQuery, [threshold]);
//         return news;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = cryptoNewsService;
