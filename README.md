<div align="center">
  <img src="https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png" height="200">
</div>

# Puppeteer_Scrapper 

## Disclaimer

Please don't use this tool on a public-facing website without the explicit permission of the site maintainer or the developers. Please read the "Terms of Service" (TOS) of the Guidelines of the website before working with the tool.

## Overview

This is a command-line tool written in Node.js that allows you to scrape data from a URL and store it in a JSON file. You can also manipulate the scraped data using flags for author and tag filtering.

## Usage

To use the scraper, follow these instructions:

### Scrape Data

If you don't have a scraped data file yet, run the following command to start web scraping:

```bash
node <file.js> scrape
```
Replace <file.js> with the name of your Node.js script and <url> with the URL you want to scrape.

### Categorize Data
Once you have scraped data, you can categorize it using the following flags:
-a or --author "author name": Filter data by the author's name.
-t or --tag "tag name": Filter data by the tag's name.

- For example:
```bash
node scraper.js categorize -a "John Doe"
node scraper.js categorize -t "Technology"
```
This command will categorize the scraped data by filtering for entries with the author "John Doe" or with the tag "Technology."

### Store Data
The data will be stored in a JSON file for further analysis.

Here's an example of how to use the scraper:

Run the scraper to fetch data from a URL:
```bash
node scraper.js scrape
```

Categorize the scraped data by filtering for a specific author and tag:
```bash
node scraper.js categorize -a "John Doe"
```
OR
```bash
node <file_name>.js categorize -t "Technology"
```

The categorized data is displayed for your analysis.
