import { jsonModeModels } from '@/dev/data/models';

export function isJsonModeOn({
	currentModel,
	jsonMode
}: {
	currentModel: string;
	jsonMode: boolean;
}) {
	const modelHasJsonMode = jsonModeModels.includes(currentModel);
	const jsonModeOn = jsonMode;
	if (jsonModeOn && modelHasJsonMode) {
		return true;
	}

	return false;
}
