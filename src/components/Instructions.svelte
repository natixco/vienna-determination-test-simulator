<script>
    import { t } from '$lib/translations/index.js';
</script>

<div class="flex flex-col gap-6">
    <p>
        {$t('INSTRUCTIONS.DESCRIPTION')}
    </p>

    <div class="flex flex-col gap-1">
        <h2 class="font-bold">
            {$t('INSTRUCTIONS.HOW_TO_PLAY')}
        </h2>
        <ul class="list-disc list-inside">
            <li>
                {$t('INSTRUCTIONS.STEPS.SPEED')}
            </li>
            <li>
                {$t('INSTRUCTIONS.STEPS.COLORS')}
            </li>
            <li>
                {$t('INSTRUCTIONS.STEPS.PEDALS')}
            </li>
            <li>
                {$t('INSTRUCTIONS.STEPS.SOUNDS')}
            </li>
            <li>
                {$t('INSTRUCTIONS.STEPS.TIMING')}
            </li>
        </ul>
    </div>

    <div class="flex flex-col gap-1">
        <h2 class="font-bold">
            {$t('INSTRUCTIONS.SCORING.TITLE')}
        </h2>
        <p>{$t('INSTRUCTIONS.SCORING.DESCRIPTION')}</p>
        <ul class="list-disc list-inside">
            <li>{$t('INSTRUCTIONS.SCORING.ACCURACY')}</li>
            <li>{$t('INSTRUCTIONS.SCORING.SPEED')}</li>
        </ul>
    </div>
</div>