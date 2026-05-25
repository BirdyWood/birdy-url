```
 ___  _          _        _   _  ___  _    
| _ )(_) _ _  __| | _  _ | | | || _ \| |   
| _ \| || '_|/ _` || || || |_| ||   /| |__ 
|___/|_||_|  \__,_| \_, | \___/ |_|_\|____|
                    |__/                   
```

Convert a URL into a clean human-readable display name for redirect and external-link UIs.

---

## Usage

Download `birdy-url.js` from the [latest release](https://github.com/BirdyWood/birdy-url/releases/latest) and include it in your project:

```js
import { humanizeUrl } from "./birdy-url.js";

const { displayName, verified } = humanizeUrl("https://dashboard.birdywood.fr");
console.log(displayName); // "BirdyWood Dashboard"
console.log(verified);    // true
```

Or load it directly from GitHub releases without downloading:

```html
<script type="module">
  import { humanizeUrl } from "https://github.com/BirdyWood/birdy-url/releases/latest/download/birdy-url.js";
</script>
```

## Return value

```js
{
  displayName: string,  // clean human-readable name
  verified: boolean     // true if the domain is a known brand
}
```

`verified` is useful for trust indicators — show a checkmark for known brands, a warning for unknown ones.

## Examples

| URL | `displayName` | `verified` |
|-----|---------------|------------|
| `https://stripe.com` | `Stripe` | `true` |
| `https://dashboard.stripe.com` | `Stripe Dashboard` | `true` |
| `https://docs.github.com` | `GitHub Docs` | `true` |
| `https://cdn.api.github.com` | `GitHub` | `true` |
| `https://www.birdywood.fr` | `Birdywood` | `true` |
| `https://bbc.co.uk` | `BBC` | `true` |
| `https://gooogle.com` | `Gooogle` | `false` |
| `https://my-cool-app.com` | `My Cool App` | `false` |
| `https://192.168.1.1` | `Website` | `false` |

---

MIT — [BirdyWood](https://birdywood.fr)
