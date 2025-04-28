import scrapy


class NewsItem(scrapy.Item):
    title = scrapy.Field()
    content = scrapy.Field()
    url = scrapy.Field()
    image = scrapy.Field()
    pub_date = scrapy.Field()