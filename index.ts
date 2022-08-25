import yargs from "yargs";
import { Bech32Address } from "@keplr-wallet/cosmos";
import { hideBin } from "yargs/helpers";
import Table from "cli-table";
import chalk from "chalk";
import { assets, chains, ibc } from "chain-registry";

const convertAddress = (address: string, prefix: string) => {
  try {
    const key = Bech32Address.fromBech32(address);
    return key.toBech32(prefix);
  } catch (error) {
    console.log(error);
    return address;
  }
};

const printConvertedAddress = (address: string, prefix: string) => {
  const table = new Table({
    head: [
      chalk.cyan.bold.underline("Prefix"),
      chalk.green.bold.underline("Address"),
    ],
    colWidths: [25, 50],
  });

  table.push([
    chalk.cyan(prefix),
    chalk.green(convertAddress(address, prefix)),
  ]);

  console.log(chalk.yellow.bold("Source Address:"), chalk.yellow(address));
  console.log(table.toString());
};

const listAddresses = (address: string) => {
  const table = new Table({
    head: [
      chalk.cyan.bold.underline("Chain"),
      chalk.green.bold.underline("Address"),
    ],
    colWidths: [25, 50],
  });
  try {
    Bech32Address.validate(address);

    chains.forEach((chain) => {
      table.push([
        chalk.cyan(chain.pretty_name),
        chalk.green(convertAddress(address, chain.bech32_prefix)),
      ]);
    });

    console.log(table.toString());
  } catch (error) {
    console.log(error);
  }
};

yargs(hideBin(process.argv))
  .version("1.0.0")
  .command(
    "list <address>",
    "lists alternate addresses for a given bech address",
    (argv) => {
      return argv.positional("address", {
        type: "string",
        describe: "known wallet address",
        demandOption: true,
      });
    },
    (argv) => {
      listAddresses(argv["address"]);
    }
  )
  .command(
    "convert <address> <prefix>",
    "convert from one address to another",
    (argv) => {
      return argv
        .positional("address", {
          type: "string",
          describe: "known wallet address",
          demandOption: true,
        })
        .positional("prefix", {
          type: "string",
          describe: "network prefix",
          demandOption: true,
        });
    },
    (argv) => {
      printConvertedAddress(argv["address"], argv["prefix"]);
    }
  )
  .demandCommand(1)
  .parse();
