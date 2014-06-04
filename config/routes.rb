Rails.application.routes.draw do

  get 'conmen/:govtrack_id/ideology', to: "conmen#ideology", as: :ideology
  get 'conmen/:govtrack_id/similar', to: "conmen#similar", as: :similar

	#get 'home/all_tweets/:twitter_ids', to: "home#all_tweets", as: :all_tweets
	get 'tweets/all_tweets', to: "tweets#all_tweets", as: :all_tweets

	get 'tweets/all_tweets/:last_id', to: "tweets#refresh_tweets", as: :refresh_tweets

	get 'tweets/state_tweets/:state_congs', to: "tweets#state_tweets", as: :state_tweets
	get 'tweets/state_tweets/:state_congs/:last_id', to: "tweets#refresh_state_tweets", as: :refresh_state_tweets

	root "home#index"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
