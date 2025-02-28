<script lang="ts">
  import { t } from '$lib/translations';
</script>

<div class="flex flex-col gap-4">
    <p class="text-stone-600">
        {$t('INSTRUCTIONS.DESCRIPTION')}
    </p>

    <div class="flex flex-col gap-2">
        <h2 class="text-xl font-semibold">
            {$t('INSTRUCTIONS.HOW_TO_PLAY')}
        </h2>

        <ul class="list-disc list-inside flex flex-col gap-2">
            <li>{$t('INSTRUCTIONS.STEPS.MODE')}</li>
            <li>{$t('INSTRUCTIONS.STEPS.SPEED')}</li>
            <li>{$t('INSTRUCTIONS.STEPS.COLORS')}</li>
            <li>{$t('INSTRUCTIONS.STEPS.PEDALS')}</li>
            <li>{$t('INSTRUCTIONS.STEPS.SOUNDS')}</li>
            <li>{$t('INSTRUCTIONS.STEPS.TIMING')}</li>
        </ul>
    </div>

    <div class="flex flex-col gap-2">
        <h2 class="text-xl font-semibold">
            {$t('INSTRUCTIONS.SCORING.TITLE')}
        </h2>

        <p>{$t('INSTRUCTIONS.SCORING.DESCRIPTION')}</p>
        <ul class="list-disc list-inside">
            <li>{$t('INSTRUCTIONS.SCORING.ACCURACY')}</li>
            <li>{$t('INSTRUCTIONS.SCORING.SPEED')}</li>
        </ul>
    </div>
</div>