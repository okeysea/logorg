module FlashMessagesHelper
  # flash message
  def flash_message_now(type, message)
    flash.now[type] ||= []
    flash.now[type] << message
  end

  def flash_message(type, message)
    flash[type] ||= []
    flash[type] << message
  end
end
