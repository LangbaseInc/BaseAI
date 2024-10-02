import * as tcpPortUsed from 'tcp-port-used';

export async function isPortInUse(port: number): Promise<boolean> {
	try {
		const inUse = await tcpPortUsed.check(port);
		return inUse;
	} catch (error) {
		return false;
	}
}
