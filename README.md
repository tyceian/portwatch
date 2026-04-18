# portwatch

> CLI tool to monitor and alert on local port activity during development

## Installation

```bash
npm install -g portwatch
```

## Usage

Start watching a specific port:

```bash
portwatch --port 3000
```

Watch multiple ports and get desktop alerts when activity is detected:

```bash
portwatch --port 3000 8080 8443 --alert
```

Run in the background and log activity to a file:

```bash
portwatch --port 3000 --log activity.log
```

### Options

| Flag | Description |
|------|-------------|
| `--port` | Port(s) to monitor |
| `--alert` | Enable desktop notifications |
| `--log` | Log output to a file |
| `--interval` | Polling interval in ms (default: 1000) |

## Development

```bash
git clone https://github.com/yourname/portwatch
cd portwatch
npm install
npm run build
```

## License

MIT