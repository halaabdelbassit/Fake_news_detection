
import sqlite3

class ArabicNewsScraperPipeline:
    def process_item(self, item, spider):
        return item

class SQLitePipeline:

    def open_spider(self, spider):
        self.connection = sqlite3.connect("news.db")
        self.cursor = self.connection.cursor()
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS news (
                title TEXT,
                content TEXT,
                url TEXT,
                pub_date TEXT,
                PRIMARY KEY (pub_date, title)
            )
        ''')
        self.connection.commit()

    def close_spider(self, spider):
        self.connection.close()

    def process_item(self, item, spider):
        self.cursor.execute('''
            INSERT INTO news (title, content, url, pub_date) 
            VALUES (?, ?, ?, ?)
        ''', (
            item['title'],
            item['content'],
            item['url'],
            item['pub_date']
        ))
        self.connection.commit()
        return item

