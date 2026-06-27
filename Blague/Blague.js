import fetch from "node-fetch";

export async function init () {
    await Avatar.lang.addPluginPak('Blague');
}

export async function action(data, callback) {

  try {

    const L = await Avatar.lang.getPak('Blague', data.language);

    const tblActions = {
      laugh: () => laugh(data.client, L)
    };

    info("Blague:", data.action.command, "from", data.client);

    if (tblActions[data.action.command]) {
			await tblActions[data.action.command]();
		}

  } catch (error) {
        if (data.client) Avatar.Speech.end(data.client);
        error("Blague Error:", error.message);
    }

  callback();
}


const laugh = async (client, L) => {

  try {

    const response = await fetch("https://blague-api.vercel.app/api?mode=global");

    if (!response.ok) {
      throw new Error(L.get("speech.errorApi", response.status));
    }

    const data = await response.json();

    if (!data?.blague || !data?.reponse) {
			throw new Error(L.get("speech.errorFormat"));
		}
       const message = L.get(["speech.laugh", data.blague, data.reponse]);

        info(message);

    Avatar.speak(message, client, () => Avatar.Speech.end(client),);

	} catch (err) {
		error(`Laugh Error: ${err.message}`);
    Avatar.speak(L.get("speech.errorAccess"), client, () => Avatar.Speech.end(client));
	}
};
