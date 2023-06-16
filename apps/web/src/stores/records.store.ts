import { defineStore } from 'pinia';

import { QueryRecordsParams, Record, fetchWrapper } from '@/helpers';
import { OperationPayload } from '@/views/OperationView.vue';

const baseUrl = `${import.meta.env.VITE_API_URL}/v1/record`;
const DefaultLimit = 10;

export type StoreType<T> = {
  loading?: boolean;
  error?: string;
  store?: T;
  count?: number;
};

export const useRecordsStore = defineStore({
  id: 'records',
  state: (): {
    records?: StoreType<Record[]>;
    operation?: StoreType<Record>;
    query: QueryRecordsParams & { limit: number };
  } => ({
    operation: undefined,
    records: undefined,
    query: { limit: DefaultLimit },
  }),
  actions: {
    setQuery(query: QueryRecordsParams) {
      const newQuery: typeof this.query = { limit: DefaultLimit };
      for (const [key, value] of Object.entries({ ...this.query, ...query })) {
        if (value) (newQuery as any)[key] = value;
      }
      this.query = newQuery;
    },

    async getRecords(params?: QueryRecordsParams) {
      this.records = { ...this.records, loading: true };
      this.query = { ...this.query, ...params };
      await fetchWrapper
        .get(baseUrl, undefined, this.query)
        .then(
          (result) =>
            (this.records = { store: result.records, count: result.count }),
        )
        .catch((error) => (this.records = { error }));
    },

    async postOperation(params: OperationPayload) {
      this.operation = { loading: true };
      await fetchWrapper
        .post(baseUrl, params)
        .then((result) => (this.operation = { store: result }))
        .catch((error) => (this.operation = { error }));
    },

    async deleteRecord(index: number, record: Record) {
      if (this.records) {
        this.records.loading = true;
        await fetchWrapper
          .delete(baseUrl, { id: record.id })
          .then(() => {
            this.records!.store?.splice(index, 1);
            this.records!.loading = false;
          })
          .catch((error) => (this.records!.error = error));
      }
    },
  },
});
