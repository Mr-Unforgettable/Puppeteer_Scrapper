import puppeteer from "puppeteer";
import fs from "fs";
import { program } from "commander";

const getQuotes = async () => {
    let browser;
    console.log("[+] Connecting to URL...");

    try {
        // Start a Puppeteer session with:
        // - a visible browser (`headless: false`)
        // - no default viewport (`defaultViewport: null`)
        browser = await puppeteer.launch({
            headless: "new",
            defaultViewport: null,
        });

        // Open a page
        const page = await browser.newPage();

        // On this new page:
        // - open the "http://quotes.toscrape.com/" website
        // - wait till the dom content is loaded (HTML is ready)
        await page.goto("http://quotes.toscrape.com/", {
            waitUntil: "domcontentloaded",
        });

        const allQuotes = [];

        console.log("[+] Process Started ...")
        while (true) {
            // Get the quotes and tags
            const quotes = await page.evaluate(async () => {
                // Fetch the first element with the class "quote"
                const quoteList = document.querySelectorAll('.quote');

                // Convert the quoteList to an iterable array
                // For each quote fetch the text and author
                return Promise.all(Array.from(quoteList).map(async (quote) => {
                    // Fetch the sub-elements from the previously fetched quote element
                    // Get the displayed text and return it (`.innerText`)
                    const text = quote.querySelector('.text').innerText;
                    const author = quote.querySelector('.author').innerText;

                    // Wait for the tags to be available.
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const tags = Array.from(quote.querySelectorAll('.tags .tag')).map(tag => tag.innerText.trim());

                    return { text, author, tags };
                }));

            });

            allQuotes.push(...quotes);

            // Click on the "Next page" button if available
            const nextPageButton = await page.$('.pager > .next > a');
            if (!nextPageButton) {
                break; // Exit the loop if there's no next page button
            }
            await nextPageButton.click();
            await page.waitForNavigation();
        }

        const scrappedDataJSON = JSON.stringify(allQuotes);
        const fileName = "data.json";

        // save the JSON data to a file
        fs.writeFileSync(fileName, scrappedDataJSON, "utf-8");
        console.log(`[+] Scrap Successful! 🎉`);
        console.log(`Data saved to a ${fileName} 📁`);

    } catch (error) {
        console.error("An error occured:", error);
        throw error;

    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

// // Start the scrapping
// getQuotes().catch((error) => {
//     console.error("getQuotes function failed:", error);
// });

const categorizeQuotes = (file, options) => {
    try {
        const data = fs.readFileSync(file, "utf-8");
        const allQuotes = JSON.parse(data);

        if (options.author) {
            const authorQuotes = allQuotes.filter(quote => quote.author === options.author);
            console.log(`Quotes by author '${options.author}':`, authorQuotes);
        } else if (options.tag) {
            const tagQuotes = allQuotes.filter(quote => quote.tags.includes(options.tag));
            console.log(`Quotes with tag '${options.tag}':`, tagQuotes);
        } else {
            console.error("Please specify either an author or a tag.");
        }
    } catch (error) {
        console.error("An error occurred while categorizing quotes:", error);
    }
};

program
    .version("1.0.0")
    .description("Categorize quotes by author or tag from a JSON file");

// Define the "scrape" command
program
    .command("scrape")
    .description("Scrape quotes and save to a JSON file")
    .action(async () => {
        // Check if the scraped data file already exists
        const scrapedDataFileExists = fs.existsSync("scrapped_Data.json");

        if (!scrapedDataFileExists) {
            // If the file doesn't exist, perform scraping
            try {
                await getQuotes();
            } catch (error) {
                console.error("An error occurred while scraping:", error);
            }
        } else {
            console.log("The scraped data file already exists.");
        }
    });

// Define the "categorize" command
program
    .command("categorize <file>")
    .description("Categorize quotes from a JSON file")
    .option("-a, --author <author>", "Categorize by author")
    .option("-t, --tag <tag>", "Categorize by tag")
    .action(categorizeQuotes);

// Parse command-line arguments
program.parse(process.argv);