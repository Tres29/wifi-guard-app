import axios from "axios";

const ADGUARD_URL = process.env.ADGUARD_URL!;
const USERNAME = process.env.ADGUARD_USERNAME!;
const PASSWORD = process.env.ADGUARD_PASSWORD!;

const auth = {
username: USERNAME,
password: PASSWORD,
};

export async function blockDomain(domain: string) {
return axios.post(
`${ADGUARD_URL}/control/filtering/add_url`,
{
name: domain,
url: `||${domain}^`,
},
{ auth }
);
}

export async function unblockDomain(domain: string) {
return axios.post(
`${ADGUARD_URL}/control/filtering/remove_url`,
{
url: `||${domain}^`,
},
{ auth }
);
}

export async function getStats() {
return axios.get(`${ADGUARD_URL}/control/stats`, {
auth,
});
}
