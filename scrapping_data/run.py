from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from Scrapy.spiders.aljazeera_spider import AljazeeraSpider
from Scrapy.spiders.alarbiya_spider import AlarabiyaSpider
from Scrapy.spiders.bbc_spider import BBCSpider
from Scrapy.spiders.echorouk_spider import EchoroukSpider

settings = get_project_settings()
process = CrawlerProcess(settings)
process.crawl(AljazeeraSpider) # good
process.crawl(EchoroukSpider)  # good
process.start()