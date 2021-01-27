import { render } from '@testing-library/svelte';
import { expect } from 'chai';
import App from './App.svelte';

describe('<App>', () => {
    it('renders title', () => {
        const { getByText } = render(App);
        const linkElement = getByText(/Sumit Rai/i);
        expect(document.body.contains(linkElement));
    });
});
