import Layout from "@/components/Layout";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import GET_COUNTRIES from "@/lib/query/get-countries";
import client from "@/lib/apollo";

const Checkout = ({data}) => (
	<Layout>
		<div className="checkout container mx-auto my-32 px-4 xl:px-0">
			<h1 className="mb-5 text-2xl uppercase">Checkout Page</h1>
			<CheckoutForm countriesData={data?.wooCountries ?? {}}/>
		</div>
	</Layout>
);

export default Checkout;

export async function getStaticProps() {
	const { data } = await client.query({
		query: GET_COUNTRIES
	});

	return {
		props: {
			data: data || {}
		},
		revalidate: 1
	};

}
