const url = "https://hdtodayz.to/watch-movie/watch-demon-slayer-kimetsu-no-yaiba-infinity-castle-hd-128764.12464725";

fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" } })
  .then((r) => r.text())
  .then((html) => {
    // 1. All iframes
    const iframes = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);
    console.log("All iframes:", iframes);

    // 2. Regex test - does the streaming pattern match?
    const urlToTest = url;
    const oldPattern = /(?:hdtodayz?\.(?:to|cc|tv)|fmovies|soap2day|movieuniverse)[^/]*\/(?:watch-movie|movie)\/[^-]+-(\d+)\.\d+/i;
    const newPattern = /(?:hdtodayz?\.(?:to|cc|tv)|fmovies|soap2day|movieuniverse)[^/]*\/(?:watch-movie|movie)\/.+-(\d+)\.\d+/i;
    console.log("Old pattern matches:", oldPattern.test(urlToTest), oldPattern.exec(urlToTest)?.[1]);
    console.log("New pattern matches:", newPattern.test(urlToTest), newPattern.exec(urlToTest)?.[1]);
  });
