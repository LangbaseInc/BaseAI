import * as tcpPortUsed from 'tcp-port-used';

export async function isPortInUse(port: number): Promise<boolean> {
	try {
		const host = '127.0.0.1';
		const inUse = await tcpPortUsed.check(port, host);
		return inUse;
	} catch (error) {
		return false;
	}
}
