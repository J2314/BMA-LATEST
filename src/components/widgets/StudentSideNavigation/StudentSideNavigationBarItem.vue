<template>
    <div class="mt-5">
        <ion-accordion-group>
            <ion-accordion v-for="(data, index) in items" :key="index" :value="key">
                <ion-item v-if="!data.child" slot="content">
                    <router-link v-if="data.url" :to="data.url">
                        <ion-label>{{ data.name }}</ion-label>
                    </router-link>
                </ion-item>
                <template v-else>
                    <ion-item slot="header">
                        <ion-label>{{ data.name }}</ion-label>
                    </ion-item>
                    <ion-item v-for="(data1, index1) in data.child" :key="index1" class="ms-5 p-2"
                        slot="content">
                        <router-link v-if="data1.url" :to="data1.url">
                            <ion-label>{{ data1.name }}</ion-label>
                        </router-link>
                    </ion-item>
                </template>
            </ion-accordion>
        </ion-accordion-group>
    </div>
</template>

<script>
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/vue';
import { RouterLink } from 'vue-router';

export default {
    name: 'StudentSideNavigationBar',
    components: {
        IonAccordion,
        IonAccordionGroup,
        IonItem,
        IonLabel,
        RouterLink,
    },

    data() {

        const dashboard = [
            { name: 'Statistics', url: '/admin/statistics' },
            { name: 'Announcements', url: '/admin/announcement' },
            { name: 'Monitoring', url: '/admin/monitoring' },
            { name: 'Calendar', url: '/admin/calendar' },
        ];

        const managing = [
            { name: 'Policy Documents', url: '/admin/Add-Policy-Documents' },
            { name: 'Procedures', url: '/admin/Add-Procedures' },
            { name: 'Work Instructions', url: '/admin/Add-Work-Instructions' },
            { name: 'Departments', url: '/admin/Add-Departments' },
            { name: 'Forms', url: '/admin/Add-Forms' },
            { name: 'Records', url: '/admin/Add-Records' },
        ];

        const settings = [
            { name: 'Account Management', url: '/admin/Account-Management' },
        ];

        const items = [
            { name: 'Dashboard', child: dashboard},
            { name: 'Management', child: managing },
            { name: 'Settings', child: settings },
        ];

        return {
            items
        };
    }
};
</script>
